// customer 1

export const CustomerService = {
    getData() {
        return [
            {
                id: 1000,
                country: {
                    name: 'Spain',
                    code: 'es'
                },
                balance: 70663
            },
        ];
    },

    getCustomersSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getCustomersMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getCustomersLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getCustomersXLarge() {
        return Promise.resolve(this.getData());
    },

    getCustomers(params) {
        const queryParams = params
            ? Object.keys(params)
                  .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                  .join('&')
            : '';

        return fetch('https://www.primefaces.org/data/customers?' + queryParams).then((res) => res.json());
    },

    getEscudoSpain() {
        return 'https://example.com/escudo-espanha.png'; // Substitua pela URL correta do escudo da seleção da Espanha
    }
};
