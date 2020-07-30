class Globals {
    constructor() {
        this._selectedPage = 0;
    }

    get selectedPage() {
        return this._selectedPage;
    }
}

export let globals = new Globals();