/**
 * Дополнительные методы справочника Цвета
 *
 * Created 23.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author Evgeniy Malyarov
 * @module cat_cnns
 */


$p.modifiers.push(
	function($p) {

		$p.cat.users_acl.__define({

			load_array: {
				value: function(aattr, forse){

					var ref, obj, res = [], acl;

					for(var i in aattr){

						ref = $p.fix_guid(aattr[i]);

						acl = aattr[i].acl;
						if(acl)
							delete aattr[i].acl;

						if(!(obj = this.by_ref[ref])){
							obj = new this._obj_constructor(aattr[i], this);
							if(forse)
								obj._set_loaded();

						}else if(obj.is_new() || forse){
							obj._mixin(aattr[i]);
							obj._set_loaded();
						}

						if(acl && !obj._acl){
							var _acl = {};
							for(var i in acl){
								_acl.__define(i, {
									value: {},
									writable: false
								});
								for(var j in acl[i]){
									_acl[i].__define(j, {
										value: acl[i][j],
										writable: false
									});
								}
							}
							obj.__define({
								_acl: {
									value: _acl,
									writable: false
								}
							});
						}

						res.push(obj);
					}

					return res;
				}
			}
		});

		$p.cat.users_acl._obj_constructor.prototype.__define({

			role_available: {
				value: function (name) {
					return this.acl_objs._obj.some(function (row) {
						return row.type == name;
					});
				}
			},

			partners_uids: {
				get: function () {
					var res = [];
					this.acl_objs.each(function (row) {
						if(row.acl_obj instanceof $p.cat.partners._obj_constructor)
							res.push(row.acl_obj.ref)
					});
					return res;
				}
			}
		});

	}
);