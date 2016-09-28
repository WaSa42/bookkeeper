import { BalanceStatus } from '/imports/api/collections';

const settings = Meteor.settings.public.result;
const excludeSettings = settings.exclude;

Template.incomeStatementRead.helpers({
    getValue: function (cellKey) {
        const value = Math.round(getValue(this.accounts, cellKey));
        return value === 0 ? null : value;
    },
    getTotal: function (totalId) {
        return Math.round(getTotal(totalId, this.accounts, 'B'));
    },
});


function getAccounts(accounts, cellKey) {
    const results = [];

    settings[cellKey].forEach(conf => {
        const creditOnly = conf.endsWith('C');
        const debitOnly = conf.endsWith('D');
        const code = creditOnly || debitOnly ? conf.slice(0, -1) : conf;

        accounts.forEach(account => {
            if (account.num.startsWith(code) && !codeIsExcluded(cellKey, account.num)) {
                const isValid = creditOnly && account.getBalanceStatus() === BalanceStatus.CREDIT
                    || debitOnly && account.getBalanceStatus() === BalanceStatus.DEBIT
                    || !creditOnly && !debitOnly;

                if (isValid) {
                    results.push(account);
                }
            }
        });
    });

    return results;
}

function codeIsExcluded(cellKey, accountNum) {
    if (!excludeSettings[cellKey]) {
        return false;
    }

    return excludeSettings[cellKey]
        .some(excludedAccountNum => accountNum.startsWith(excludedAccountNum));
}

function getValue(accounts, cellKey) {
    return getAccounts(accounts, cellKey).reduce((a, b) => a + Math.abs(b.balance), 0);
}

function getCellPosition(cellKey) {
    return {
        col: cellKey[0],
        row: parseInt(cellKey.slice(1))
    };
}

function getTotal(totalId, accounts, column) {
    switch (totalId) {
        // TODO: case turnover
        case 1:
            return getTotalCells(
                accounts,
                (col, row) => col === column && row <= 10
            );
        case 2:
            return getTotalCells(
                accounts,
                (col, row) => col === column && row >= 13 && row <= 29,
            );
        // TODO: case operating-income
        case 5:
            return getTotalCells(
                accounts,
                (col, row) => col === column && row >= 36 && row <= 41,
            );
        case 6:
            return getTotalCells(
                accounts,
                (col, row) => col === column && row >= 44 && row <= 47,
            );
        case 'financial-result':
            return getTotal(5, accounts, column) - getTotal(4, accounts, column);
        case 'current-profit':
            return getTotal(1, accounts, column) - getTotal(2, accounts, column)
                + getTotal(3, accounts, column) - getTotal(4, accounts, column)
                + getTotal(5, accounts, column) - getTotal(6, accounts, column);
        case 7:
            return getTotalCells(
                accounts,
                (col, row) => col === column && row >= 53 && row <= 55,
            );
        case 8:
            return getTotalCells(
                accounts,
                (col, row) => col === column && row >= 58 && row <= 60,
            );
        case 'exceptional-result':
            return getTotal(7, accounts, column) - getTotal(8, accounts, column);
        case 'products':
            return getTotal(1, accounts, column) - getTotal(3, accounts, column)
                + getTotal(5, accounts, column) - getTotal(7, accounts, column);
        case 'charges':
            return getTotal(2, accounts, column) - getTotal(4, accounts, column)
                + getTotal(6, accounts, column) - getTotal(8, accounts, column)
                + getTotal(9, accounts, column) - getTotal(10, accounts, column);
        // TODO: case result
        default:
            console.log('Not implemented');
            // TODO
            return 0;
            // throw new Error('Not implemented');
    }
}

function getTotalCells(accounts, filter) {
    const cellKeys = _.keys(settings).filter(cellKey => {
        const cellPosition = getCellPosition(cellKey);
        return filter(cellPosition.col, cellPosition.row);
    });

    return cellKeys.reduce((a, b) => a + getValue(accounts, b), 0);
}
