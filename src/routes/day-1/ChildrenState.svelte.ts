import childrenData from '$lib/payloads/day-1.json';

interface Child {
	name: string;
	tally: number;
}

export default class ChildrenState {
	children = $state<Child[]>([]);
	newName = $state('');
	newTally = $state(0);

	constructor() {
		this.fetchChildren();
	}

	fetchChildren() {
		this.children = childrenData;
	}

	addChild() {
		this.children = [...this.children, { name: this.newName, tally: this.newTally }];
		this.newName = '';
		this.newTally = 0;
	}

	getStatus(tally: number) {
		return tally >= 0 ? '😇 Nice' : '😈 Naughty';
	}
}
