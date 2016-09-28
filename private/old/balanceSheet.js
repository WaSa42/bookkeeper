import { BalanceStatus } from '/imports/api/collections';

Template.balanceSheetRead.helpers({
    actives: function () {
        return getAccounts(this.balanceSheetAccounts, BalanceStatus.DEBIT);
    },
    totalActives: function () {
        return getTotal(this.balanceSheetAccounts, BalanceStatus.DEBIT);
    },
    passives: function () {
        return getAccounts(this.balanceSheetAccounts, BalanceStatus.CREDIT);
    },
    totalPassives: function (result) {
        return getTotal(this.balanceSheetAccounts, BalanceStatus.CREDIT) + result;
    },
    result: function () {
        return getTotal(this.incomeStatementAccounts, BalanceStatus.CREDIT)
            - getTotal(this.incomeStatementAccounts, BalanceStatus.DEBIT);
    },
    isResultZero: function (result) {
        return result === 0;
    },
    isResultPositive: function (result) {
        return result > 0;
    }
});

function getAccounts(accounts, status) {
    return accounts.filter(account => account.getBalanceStatus() === status);
}

function getTotal(accounts, status) {
    return getAccounts(accounts, status).reduce((a, b) => a + Math.abs(b.balance), 0);
}
