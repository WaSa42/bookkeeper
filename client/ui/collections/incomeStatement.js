import { BalanceStatus } from '/imports/api/collections';

const settings = Meteor.settings.public.result;
const excludeSettings = settings.exclude;

Template.incomeStatementRead.helpers({
    getValue: function (cellKey) {
        const value = Math.round(getValue(this.accounts, cellKey, this.fiscal));
        return value === 0 ? null : getCleanNumber(value);
    },
    getTotal: function (totalId) {
        return getCleanNumber(Math.round(getTotal(totalId, this.accounts, 'B', this.fiscal)));
    },
});

function addFiscalSettings(settings) {
    const fiscalSettings = [];

    settings.forEach(conf => {
        if (!conf.endsWith('C') && !conf.endsWith('D')) {
            fiscalSettings.push(`F${conf}`);
        }
    });

    return _.union(settings, fiscalSettings);
}

function getAccounts(accounts, cellKey, fiscal) {
    const results = [];

    let tmpSettings = {
        ...settings
    };

    if (fiscal) {
        tmpSettings[cellKey] = addFiscalSettings(tmpSettings[cellKey]);
    }

    tmpSettings[cellKey].forEach(conf => {
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

function getValue(accounts, cellKey, fiscal) {
    return getAccounts(accounts, cellKey, fiscal).reduce((a, b) => {
        // Fiscal
        if (b.num.startsWith('F')) {
            return a + b.balance;
        }

        // Production stockée
        if (cellKey === 'B6') {
            if (b.getBalanceStatus() === BalanceStatus.CREDIT) {
                return a + Math.abs(b.balance);
            } else {
                return a - Math.abs(b.balance);
            }
        }

        // Variation de stock
        else if (cellKey === 'B14' || cellKey === 'B16') {
            if (b.getBalanceStatus() === BalanceStatus.DEBIT) {
                return a + Math.abs(b.balance);
            } else {
                return a - Math.abs(b.balance);
            }
        }

        // Impôts
        else if (cellKey === 'B64') {
            return a - Math.abs(b.balance);
        }

        else if (b.num.startsWith('6')) {
            return a - b.balance;
        } else if (b.num.startsWith('7')) {
            return a + b.balance;
        }

        return a + b.balance;
    }, 0);
}

function getCellPosition(cellKey) {
    return {
        col: cellKey[0],
        row: parseInt(cellKey.slice(1))
    };
}

function getTotal(totalId, accounts, column, fiscal) {
    switch (totalId) {
        case 'turnover':
            return getTotalCells(accounts, (col, row) => col === column && row >= 3 && row <= 4, fiscal);
        case 1:
            return getTotalCells(accounts, (col, row) => col === column && row <= 10, fiscal);
        case 2:
            return getTotalCells(accounts, (col, row) => col === column && row >= 13 && row <= 29, fiscal);
        case 'operating-income':
            return getTotal(1, accounts, column, fiscal) - getTotal(2, accounts, column, fiscal);
        case 5:
            return getTotalCells(accounts, (col, row) => col === column && row >= 36 && row <= 41, fiscal);
        case 6:
            return getTotalCells(accounts, (col, row) => col === column && row >= 44 && row <= 47, fiscal);
        case 'financial-result':
            return getTotal(5, accounts, column, fiscal) - getValue(accounts, 'B34', fiscal);
        case 'current-profit':
            return getTotal(1, accounts, column, fiscal) - getTotal(2, accounts, column, fiscal)
                + getValue(accounts, 'B33', fiscal) - getValue(accounts, 'B34', fiscal)
                + getTotal(5, accounts, column, fiscal) - getTotal(6, accounts, column, fiscal);
        case 7:
            return getTotalCells(accounts, (col, row) => col === column && row >= 53 && row <= 55, fiscal);
        case 8:
            return getTotalCells(accounts, (col, row) => col === column && row >= 58 && row <= 60, fiscal);
        case 'exceptional-result':
            return getTotal(7, accounts, column, fiscal) - getTotal(8, accounts, column, fiscal);
        case 'products':
            return getTotal(1, accounts, column, fiscal) + getValue(accounts, 'B33', fiscal)
                + getTotal(5, accounts, column, fiscal) + getTotal(7, accounts, column, fiscal);
        case 'charges':
            return getTotal(2, accounts, column, fiscal) + getValue(accounts, 'B34', fiscal)
                + getTotal(6, accounts, column, fiscal) + getTotal(8, accounts, column, fiscal)
                + getValue(accounts, 'B63', fiscal) + getValue(accounts, 'B64', fiscal);
        case 'result':
            return getTotal('products', accounts, column, fiscal) - getTotal('charges', accounts, column, fiscal);
        default:
            throw new Error(`Total ${totalId} not implemented`);
    }
}

function getTotalCells(accounts, filter, fiscal) {
    const cellKeys = _.keys(settings).filter(cellKey => {
        const cellPosition = getCellPosition(cellKey);
        return filter(cellPosition.col, cellPosition.row);
    });

    return cellKeys.reduce((a, b) => a + getValue(accounts, b, fiscal), 0);
}
