// Removes focus from the currenty highlighted element
function unfocus() {
	if (document.activeElement instanceof HTMLElement) {
		document.activeElement.blur();
	}
}

export { unfocus };
