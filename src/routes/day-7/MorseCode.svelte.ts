const MORSE_CODE: { [key: string]: string } = {
	A: '.-',
	B: '-...',
	C: '-.-.',
	D: '-..',
	E: '.',
	F: '..-.',
	G: '--.',
	H: '....',
	I: '..',
	J: '.---',
	K: '-.-',
	L: '.-..',
	M: '--',
	N: '-.',
	O: '---',
	P: '.--.',
	Q: '--.-',
	R: '.-.',
	S: '...',
	T: '-',
	U: '..-',
	V: '...-',
	W: '.--',
	X: '-..-',
	Y: '-.--',
	Z: '--..',
	'0': '-----',
	'1': '.----',
	'2': '..---',
	'3': '...--',
	'4': '....-',
	'5': '.....',
	'6': '-....',
	'7': '--...',
	'8': '---..',
	'9': '----.'
};

export function textToMorse(text: string): string {
	return text
		.toUpperCase()
		.split('')
		.map((char) => {
			if (char === ' ') return ' / ';
			return MORSE_CODE[char] ? MORSE_CODE[char] + ' ' : '';
		})
		.join('')
		.trim();
}

export function playMorseCode(audioContext: AudioContext, morseCode: string): Promise<void> {
	const dotDuration = 0.1;
	const dashDuration = dotDuration * 3;
	const elementPause = dotDuration;
	const letterPause = dotDuration * 3;
	const wordPause = dotDuration * 7;
	const frequencyHz = 600;

	return new Promise((resolve) => {
		let currentTime = audioContext.currentTime;

		morseCode.split('').forEach((symbol) => {
			if (symbol === '.') {
				playTone(currentTime, dotDuration);
				currentTime += dotDuration + elementPause;
			} else if (symbol === '-') {
				playTone(currentTime, dashDuration);
				currentTime += dashDuration + elementPause;
			} else if (symbol === ' ') {
				currentTime += letterPause;
			} else if (symbol === '/') {
				currentTime += wordPause;
			}
		});

		setTimeout(resolve, (currentTime - audioContext.currentTime) * 1000);
	});

	function playTone(startTime: number, duration: number) {
		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();

		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(frequencyHz, startTime);

		gainNode.gain.setValueAtTime(1, startTime);
		gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);

		oscillator.start(startTime);
		oscillator.stop(startTime + duration);
	}
}

export default class MorseCodeTranslator {
	inputText = $state('');
	outputMorse = $derived(textToMorse(this.inputText));
	isPlaying = $state(false);
	#audioContext: AudioContext | undefined;

	getAudioContext() {
		return (this.#audioContext ||= new AudioContext());
	}

	async playMorseCode() {
		if (this.isPlaying) return;
		this.isPlaying = true;
		await playMorseCode(this.getAudioContext(), this.outputMorse);
		this.isPlaying = false;
	}
}
