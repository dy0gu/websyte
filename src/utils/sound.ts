type SoundOptions = {
	onEnd?: () => void;
	volume?: number;
};

function sound(file: string, { onEnd, volume = 0.4 }: SoundOptions = {}) {
	const audio = new Audio(file);
	audio.volume = volume;
	if (onEnd) {
		audio.onended = onEnd;
	}
	audio.play();
}

export { sound };
