export default class CookieCounter {
	cookieCount = $state(0);
	santaMood = $state('😐');

	addCookie() {
		this.cookieCount++;
		this.updateMood();
	}

	removeCookie() {
		if (this.cookieCount > 0) {
			this.cookieCount--;
			this.updateMood();
		}
	}

	resetCount() {
		this.cookieCount = 0;
		this.updateMood();
	}

	updateMood() {
		if (this.cookieCount < 10) this.santaMood = '😐';
		else if (this.cookieCount < 20) this.santaMood = '🙂';
		else if (this.cookieCount < 30) this.santaMood = '😋';
		else if (this.cookieCount < 40) this.santaMood = '🤗';
		else this.santaMood = '🎅';
	}
}
