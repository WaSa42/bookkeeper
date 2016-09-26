import { BalanceStatus } from '/imports/api/collections';

Template.balanceSheetRead.helpers({
    actives: function () {
        return getAccounts(this.accounts, BalanceStatus.DEBIT);
    },
    totalActives: function () {
        return getTotal(this.accounts, BalanceStatus.DEBIT);
    },
    passives: function () {
        return getAccounts(this.accounts, BalanceStatus.CREDIT);
    },
    totalPassives: function () {
        return getTotal(this.accounts, BalanceStatus.CREDIT);
    }
});

function getAccounts(accounts, status) {
    return accounts.filter(account => account.getBalanceStatus() === status);
}

function getTotal(accounts, status) {
    return getAccounts(accounts, status).reduce((a, b) => a + Math.abs(b.balance), 0);
}
