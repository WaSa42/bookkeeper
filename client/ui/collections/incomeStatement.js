import { BalanceStatus } from '/imports/api/collections';

Template.incomeStatementRead.helpers({
    charges: function () {
        return getAccounts(this.accounts, BalanceStatus.DEBIT);
    },
    totalCharges: function () {
        return getTotal(this.accounts, BalanceStatus.DEBIT);
    },
    products: function () {
        return getAccounts(this.accounts, BalanceStatus.CREDIT);
    },
    totalProducts: function () {
        return getTotal(this.accounts, BalanceStatus.CREDIT);
    }
});

function getAccounts(accounts, status) {
    return accounts.filter(account => account.getBalanceStatus() === status);
}

function getTotal(accounts, status) {
    return getAccounts(accounts, status).reduce((a, b) => a + Math.abs(b.balance), 0);
}
