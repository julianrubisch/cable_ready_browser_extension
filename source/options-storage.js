import OptionsSync from "webext-options-sync";

export default new OptionsSync({
	defaults: {
		overlay: true,
		duration: 5000
	},
	migrations: [OptionsSync.migrations.removeUnused],
	logging: true
});
