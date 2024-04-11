function loadUserPrefTheme() {
	const userPref = localStorage.getItem('theme')
	const userPreference =
		userPref ||
		(matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
	document.documentElement.dataset.appliedMode = userPreference
	userPref && localStorage.setItem('theme', userPreference)
}
loadUserPrefTheme()
