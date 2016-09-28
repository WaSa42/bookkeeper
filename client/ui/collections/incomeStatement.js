import { BalanceStatus } from '/imports/api/collections';

Template.incomeStatementRead.helpers({
    charges: function () {
        return getAccounts(this.accounts, BalanceStatus.DEBIT);
    },
    subTotalCharges: function () {
        return getSubTotal(this.accounts, BalanceStatus.DEBIT);
    },
    products: function () {
        return getAccounts(this.accounts, BalanceStatus.CREDIT);
    },
    subTotalProducts: function () {
        return getSubTotal(this.accounts, BalanceStatus.CREDIT);
    },
    result: function () {
        return getSubTotal(this.accounts, BalanceStatus.CREDIT)
            - getSubTotal(this.accounts, BalanceStatus.DEBIT);
    },
    isResultCharges: function (result) {
        return result >= 0;
    },
    totalCharges: function (result) {
        return result >= 0
            ? getSubTotal(this.accounts, BalanceStatus.DEBIT) + Math.abs(result)
            : getSubTotal(this.accounts, BalanceStatus.DEBIT);
    },
    totalProducts: function (result) {
        return result < 0
            ? getSubTotal(this.accounts, BalanceStatus.CREDIT) + Math.abs(result)
            : getSubTotal(this.accounts, BalanceStatus.CREDIT);
    }
});

function getAccounts(accounts, status) {
    return accounts.filter(account => account.getBalanceStatus() === status);
}

function getSubTotal(accounts, status) {
    return getAccounts(accounts, status).reduce((a, b) => a + Math.abs(b.balance), 0);
}
