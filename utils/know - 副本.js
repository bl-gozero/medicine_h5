import Vue from "vue";
import Know from "@/components/Know.vue";

let instance = null;

function createInstance() {
	const PopupClass = Vue.extend(Know);
	instance = new PopupClass();
	instance.$mount();
	document.body.appendChild(instance.$el);
}

function $know(options) {
	if (!instance) createInstance();

	if (typeof options === "string") {
		return instance.open({
			text: options
		});
	}
	return instance.open(options);
}

/** ⭐ 新增关闭方法 */
$know.close = function() {
	if (instance) {
		instance.visible = false;
	}
};

export default $know;