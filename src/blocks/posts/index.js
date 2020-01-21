import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { withSelect } from '@wordpress/data';

registerBlockType( 'wpzoom-blocks/posts', {
    title: __( 'Posts' ),
    description: __( 'Display a list of posts, optionally filtered/sorted by category or other requisites.' ),
    icon: 'list-view',
    category: 'wpzoom',
    supports: { html: false },
    example: {},
	edit: withSelect( ( select ) => {
		return {
			posts: select( 'core' ).getEntityRecords( 'postType', 'post', { orderby: 'date', order: 'desc', per_page: -1, status: 'publish' } ),
		};
	} )( ( { posts, className } ) => {
		if ( ! posts ) {
			return 'Loading...';
		}

		if ( posts && posts.length === 0 ) {
			return 'No posts';
		}

		return <ul>
			{ posts.map( ( post, i ) => <li><a className={ className } href={ post.link }>{ post.title.rendered }</a></li> ) }
		</ul>;
	} )
} );