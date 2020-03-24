import apiFetch from '@wordpress/api-fetch';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, ResponsiveWrapper, RadioControl, Spinner, TextControl, withNotices } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';

const fetchVideoImage = function( videoUrl, context, fromLibrary ) {
	if ( fromLibrary ) {
		const response = fetch( videoUrl );

		response.then( ( data ) => {
			data.blob().then( ( blob ) => {
				const url = URL.createObjectURL( blob ),
					video = document.createElement( 'video' );

				const timeupdate = () => {
					if ( snapImage() ) {
						video.removeEventListener( 'timeupdate', timeupdate );
						video.pause();
					}
				};

				const snapImage = () => {
					const canvas = document.createElement( 'canvas' );
					canvas.width = video.videoWidth;
					canvas.height = video.videoHeight;
					canvas.getContext( '2d' ).drawImage( video, 0, 0, canvas.width, canvas.height );
					const image = canvas.toDataURL();
					const success = image.length > 100000;

					if ( success ) {
						if ( context.isStillMounted ) {
							context.setState( { thumbnail: image, thumbnailWidth: video.videoWidth, thumbnailHeight: video.videoHeight } );
						}
						URL.revokeObjectURL( url );
					}

					return success;
				};

				video.addEventListener( 'loadeddata', function() { if ( snapImage() ) video.removeEventListener( 'timeupdate', timeupdate ); } );
				video.addEventListener( 'timeupdate', timeupdate );
				video.preload = 'metadata';
				video.src = url;
				video.muted = true;
				video.playsInline = true;
				video.play();
			} );
		} );
	} else {
		let url = null;
		try {
			url = new URL( videoUrl );
		} catch( e ) {}

		if ( !! url ) {
			const response = apiFetch( { method: 'POST', path: '/wpzoom-blocks/v1/video-thumbnail', data: { url: videoUrl } } );

			response.then( data => {
				if ( !! data ) {
					if ( context.isStillMounted ) {
						context.setState( { thumbnail: data.url, thumbnailHeight: data.height, thumbnailWidth: data.width } );
					}
				}
			} );
		}
	}
};

registerPlugin( 'wpzb-portfolio-video-panel', {
	render: compose(
		withNotices,
		withSelect( select => {
			const { getMedia } = select( 'core' ),
			      { getCurrentPostId, getCurrentPostType, getEditedPostAttribute } = select( 'core/editor' ),
			      postId = getCurrentPostId(),
			      postType = getCurrentPostType();

			if ( 'wpzb_portfolio' != postType ) {
				return null;
			}

			const mediaType = getEditedPostAttribute( 'meta' )[ '_wpzb_portfolio_video_type' ] || 'library',
			      mediaId = getEditedPostAttribute( 'meta' )[ '_wpzb_portfolio_video_id' ] || '',
			      mediaUrl = getEditedPostAttribute( 'meta' )[ '_wpzb_portfolio_video_url' ] || '',
			      media = 'library' == mediaType && !! mediaId ? getMedia( mediaId ) : null;

			return {
				postId,
				postType,
				mediaType,
				mediaId,
				mediaUrl,
				media
			};
		} ),
		withDispatch( ( dispatch, props ) => {
			const { editPost } = dispatch( 'core/editor' ),
			      { postType } = props;

			if ( 'wpzb_portfolio' != postType ) {
				return null;
			}

			return {
				onUpdateVideoType( type ) {
					editPost( { meta: { _wpzb_portfolio_video_type: type } } );
				},
				onUpdateVideoId( id, context ) {
					if ( id != context.props.mediaId ) {
						context.setState( { thumbnail: '', thumbnailHeight: '', thumbnailWidth: '' } );
					}

					editPost( { meta: { _wpzb_portfolio_video_id: id } } );
				},
				onUpdateVideoUrl( url, context ) {
					if ( url != context.props.mediaUrl ) {
						context.setState( { thumbnail: '', thumbnailHeight: '', thumbnailWidth: '' } );
					}

					editPost( { meta: { _wpzb_portfolio_video_url: url } } );
				},
				onRemoveVideo( context ) {
					context.setState( { thumbnail: '', thumbnailHeight: '', thumbnailWidth: '' } );

					editPost( { meta: { _wpzb_portfolio_video_id: '' } } );
				}
			};
		} )
	)( class extends Component {
		constructor() {
			super( ...arguments );

			this.state = {
				thumbnail: '',
				thumbnailHeight: '',
				thumbnailWidth: ''
			};
		}

		componentDidMount() {
			this.isStillMounted = true;
		}

		componentWillUnmount() {
			this.isStillMounted = false;
		}

		render() {
			const { media, mediaId, mediaType, mediaUrl, noticeUI, onRemoveVideo, onUpdateVideoId, onUpdateVideoType, onUpdateVideoUrl, postType } = this.props,
			      { thumbnail, thumbnailHeight, thumbnailWidth } = this.state;

			if ( 'wpzb_portfolio' != postType ) {
				return null;
			}

			const fromLibrary = 'library' == mediaType && !! mediaId && !! media,
			      fromUrl = 'service' == mediaType && !! mediaUrl;

			if ( ( fromLibrary || fromUrl ) && ! thumbnail ) {
				if ( fromLibrary ) {
					fetchVideoImage( media.source_url, this, true );
				} else if ( fromUrl ) {
					fetchVideoImage( mediaUrl, this, false );
				}
			}

			return (
				<>
					<PluginDocumentSettingPanel
						className="wpzb-portfolio-video-panel"
						icon=" "
						name="wpzb-portfolio-video-panel"
						title={ __( 'Cover Video', 'wpzoom-blocks' ) }
					>
						{ noticeUI }

						<RadioControl
							className="wpzb-button-select wpzb-button-select-nolabel"
							label={ __( 'Video Source', 'wpzoom-blocks' ) }
							onChange={ onUpdateVideoType }
							options={ [
								{ value: 'library', label: __( 'Library', 'wpzoom-blocks' ) },
								{ value: 'service', label: __( 'Service', 'wpzoom-blocks' ) }
							] }
							selected={ mediaType }
						/>

						{ 'library' == mediaType &&
							<MediaUploadCheck fallback={ ( <p>{ __( 'To edit the cover video, you need permission to upload media.', 'wpzoom-blocks' ) }</p> ) }>
								<div className="editor-post-featured-image">
									<MediaUpload
										allowedTypes={ [ 'video' ] }
										modalClass={ ! mediaId ? 'editor-post-featured-image__media-modal' : 'editor-post-featured-image__media-modal' }
										onSelect={ value => onUpdateVideoId( value.id, this ) }
										render={ ( { open } ) => (
											<>
												<Button
													className={ 'wpzb-cover-video ' + ( ! mediaId ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview' ) }
													onClick={ open }
													aria-label={ ! mediaId ? null : __( 'Edit or update the video', 'wpzoom-blocks' ) }
												>
													{ !! mediaId && !! thumbnail && (
														<ResponsiveWrapper
															isInline
															naturalHeight={ thumbnailHeight }
															naturalWidth={ thumbnailWidth }
														>
															<img src={ thumbnail } alt="" />
														</ResponsiveWrapper>
													) }

													{ !! mediaId && ! thumbnail && (
														<Spinner />
													) }

													{ ! mediaId &&
														__( 'Select from Library', 'wpzoom-blocks' ) }
												</Button>

												{ !! mediaId && !! media && ! media.isLoading && (
													<Button onClick={ open } isDefault isLarge>
														{ __( 'Replace Video', 'wpzoom-blocks' ) }
													</Button>
												) }

												{ !! mediaId && (
													<Button onClick={ () => onRemoveVideo( this ) } isLink isDestructive>
														{ __( 'Remove cover video', 'wpzoom-blocks' ) }
													</Button>
												) }
											</>
										) }
										title={ __( 'Cover video', 'wpzoom-blocks' ) }
										value={ mediaId }
									/>
								</div>
							</MediaUploadCheck>
						}

						{ 'service' == mediaType &&
							<div className="editor-post-featured-image">
								<div className={ 'wpzb-cover-video nopad components-button ' + ( ! mediaUrl ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview' ) }>
									{ !! mediaUrl && !! thumbnail && (
										<ResponsiveWrapper
											isInline
											naturalHeight={ thumbnailHeight }
											naturalWidth={ thumbnailWidth }
										>
											<img src={ thumbnail } alt="" />
										</ResponsiveWrapper>
									) }

									{ !! mediaUrl && ! thumbnail && (
										<Spinner />
									) }

									<TextControl
										className="wpzb-cover-video-url-input"
										onChange={ value => onUpdateVideoUrl( value, this ) }
										placeholder={ __( 'Enter a Video URL', 'wpzoom-blocks' ) }
										value={ mediaUrl }
									/>
								</div>
							</div>
						}
					</PluginDocumentSettingPanel>
				</>
			);
		}
	} )
} );