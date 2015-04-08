var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * PostCategory Model
 * ==================
 */

var PostCategory = new keystone.List('PostCategory', {
	// autokey: { from: 'name', path: 'key', unique: true }
});

PostCategory.add({
	name: { type: String, required: true },
	key: { type: String, noedit:true }
});

PostCategory.relationship({ ref: 'Post', path: 'categories' });

PostCategory.register();
