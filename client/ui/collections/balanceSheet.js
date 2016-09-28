import { BalanceStatus } from '/imports/api/collections';

const activeSettings = Meteor.settings.public.balanceSheet.active;
const excludeActiveSettings = activeSettings.exclude;
const passiveSettings = Meteor.settings.public.balanceSheet.passive;
const excludePassiveSettings = passiveSettings.exclude;

Template.balanceSheetRead.helpers({
    getValue: function (cellKey, active = true) {
        const value = Math.round(getValue(this.accounts, cellKey, active));
        return value === 0 ? null : value;
    },
    getActiveGrossTotal: function (totalId) {
        return Math.round(getActiveTotal(totalId, this.accounts, 'B'));
    },
    getActiveAmortizationTotal: function (totalId) {
        return Math.round(getActiveTotal(totalId, this.accounts, 'C'));
    },
    getPassiveTotal: function (totalId) {
        return Math.round(getPassiveTotal(totalId, this.accounts, 'B'));
    },
    getActiveDiff: function (row, active = true) {
        if (!activeSettings[`C${row}`]) {
            if (!activeSettings[`B${row}`]) {
                return null;
            }

            const value = Math.round(getValue(this.accounts, `B${row}`, active));
            return value === 0 ? null : value;
        }

        const diff = Math.round(
            getValue(this.accounts, `B${row}`, active) -
            getValue(this.accounts, `C${row}`, active)
        );

        return diff || null;
    },
    getTotalActiveDiff: function (totalId) {
        const diff = Math.round(
            getActiveTotal(totalId, this.accounts, 'B') -
            getActiveTotal(totalId, this.accounts, 'C')
        );

        return diff || null;
    }
});

function getAccounts(accounts, cellKey, active) {
    const settings = active ? activeSettings[cellKey] : passiveSettings[cellKey];
    const results = [];

    settings.forEach(conf => {
        const creditOnly = conf.endsWith('C');
        const debitOnly = conf.endsWith('D');
        const code = creditOnly || debitOnly ? conf.slice(0, -1) : conf;

        accounts.forEach(account => {
            if (account.num.startsWith(code) && !codeIsExcluded(cellKey, account.num, active)) {
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

function codeIsExcluded(cellKey, accountNum, active) {
    const settings = active ? excludeActiveSettings : excludePassiveSettings;

    if (!settings[cellKey]) {
        return false;
    }

    return settings[cellKey]
        .some(excludedAccountNum => accountNum.startsWith(excludedAccountNum));
}

function getValue(accounts, cellKey, active) {
    const onResultCell = !active && cellKey === 'B14';

    return getAccounts(accounts, cellKey, active)
        .reduce((a, b) => a + (onResultCell ? b.balance : Math.abs(b.balance)), 0);
}


function getCellPosition(cellKey) {
    return {
        col: cellKey[0],
        row: parseInt(cellKey.slice(1))
    };
}

function getActiveTotal(totalId, accounts, column) {
    switch (totalId) {
        case 1:
            return getTotalCells(
                accounts,
                (col, row) => col === column && row <= 27,
                true
            );
        case 2:
            return getTotalCells(
                accounts,
                (col, row) => col === column && row >= 31 && row <= 45,
                true
            );
        case 'general':
            return getTotalCells(
                accounts,
                col => col === column,
                true
            );
        default:
            throw new Error('Not implemented');
    }
}

function getPassiveTotal(totalId, accounts, column) {
    switch (totalId) {
        case 1:
            return getTotalCells(
                accounts,
                (col, row) => col === column && row <= 17,
                false
            );
        case 2:
            return getTotalCells(
                accounts,
                (col, row) => col === column && row >= 19 && row <= 22,
                false
            );
        case 3:
            return getTotalCells(
                accounts,
                (col, row) => col === column && row >= 27 && row <= 37,
                false
            );
        case 'general':
            return getTotalCells(
                accounts,
                col => col === column,
                false
            );
        default:
            throw new Error('Not implemented');
    }
}

function getTotalCells(accounts, filter, active) {
    const settings = active ? activeSettings : passiveSettings;
    const cellKeys = _.keys(settings).filter(cellKey => {
        const cellPosition = getCellPosition(cellKey);
        return filter(cellPosition.col, cellPosition.row);
    });

    return cellKeys.reduce((a, b) => a + getValue(accounts, b, active), 0);
}
