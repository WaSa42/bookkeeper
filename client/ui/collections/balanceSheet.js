import { BalanceStatus } from '/imports/api/collections';

const activeSettings = Meteor.settings.public.balanceSheet.active;
const excludeActiveSettings = activeSettings.exclude;
const passiveSettings = Meteor.settings.public.balanceSheet.passive;
const excludePassiveSettings = passiveSettings.exclude;

Template.balanceSheetRead.helpers({
    getValue: function (cellKey, active = true) {
        const value = Math.round(getValue(this.accounts, cellKey, active, this.fiscal));
        return value === 0 ? null : getCleanNumber(value);
    },
    getActiveGrossTotal: function (totalId) {
        return getCleanNumber(Math.round(getActiveTotal(totalId, this.accounts, 'B', this.fiscal)));
    },
    getActiveAmortizationTotal: function (totalId) {
        return getCleanNumber(Math.round(getActiveTotal(totalId, this.accounts, 'C', this.fiscal)));
    },
    getPassiveTotal: function (totalId) {
        return getCleanNumber(Math.round(getPassiveTotal(totalId, this.accounts, 'B', this.fiscal)));
    },
    getActiveDiff: function (row, active = true) {
        if (!activeSettings[`C${row}`]) {
            if (!activeSettings[`B${row}`]) {
                return null;
            }

            const value = Math.round(getValue(this.accounts, `B${row}`, active, this.fiscal));
            return value === 0 ? null : getCleanNumber(value);
        }

        const diff = Math.round(
            getValue(this.accounts, `B${row}`, active, this.fiscal) -
            getValue(this.accounts, `C${row}`, active, this.fiscal)
        );

        return diff ? getCleanNumber(diff) : null;
    },
    getTotalActiveDiff: function (totalId) {
        const diff = Math.round(
            getActiveTotal(totalId, this.accounts, 'B', this.fiscal) -
            getActiveTotal(totalId, this.accounts, 'C', this.fiscal)
        );

        return diff ? getCleanNumber(diff) : null;
    }
});

function getAccounts(accounts, cellKey, active, fiscal) {
    let settings = active ? activeSettings[cellKey] : passiveSettings[cellKey];
    const results = [];

    if (fiscal) {
        settings = addFiscalSettings(settings);
    }

    settings.forEach(conf => {
        const creditOnly = conf.endsWith('C');
        const debitOnly = conf.endsWith('D');
        const code = creditOnly || debitOnly ? conf.slice(0, -1) : conf;

        accounts.forEach(account => {
            if (account.num.startsWith(code) && !codeIsExcluded(cellKey, account.num, active, fiscal)) {
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

function addFiscalSettings(settings) {
    const fiscalSettings = [];

    settings.forEach(conf => {
        if (!conf.endsWith('C') && !conf.endsWith('D')) {
            fiscalSettings.push(`F${conf}`);
        }
    });

    return _.union(settings, fiscalSettings);
}

function codeIsExcluded(cellKey, accountNum, active, fiscal) {
    let settings = active ? excludeActiveSettings : excludePassiveSettings;

    if (!settings[cellKey]) {
        return false;
    }

    if (fiscal) {
        _.each(settings, (confs, cellKey) => {
            settings[cellKey] = addFiscalSettings(confs);
        });
    }

    return settings[cellKey]
        .some(excludedAccountNum => accountNum.startsWith(excludedAccountNum));
}

function getValue(accounts, cellKey, active, fiscal) {
    const onResultCell = !active && cellKey === 'B14';

    return getAccounts(accounts, cellKey, active, fiscal)
        .reduce((a, b) => a + (onResultCell ? b.balance : Math.abs(b.balance)), 0);
}


function getCellPosition(cellKey) {
    return {
        col: cellKey[0],
        row: parseInt(cellKey.slice(1))
    };
}

function getActiveTotal(totalId, accounts, column, fiscal) {
    switch (totalId) {
        case 1:
            return getTotalCells(accounts, (col, row) => col === column && row <= 27, true, fiscal);
        case 2:
            return getTotalCells(accounts, (col, row) => col === column && row >= 31 && row <= 45, true, fiscal);
        case 'general':
            return getTotalCells(accounts, col => col === column, true, fiscal);
        default:
            throw new Error(`Total ${totalId} not implemented`);
    }
}

function getPassiveTotal(totalId, accounts, column, fiscal) {
    switch (totalId) {
        case 1:
            return getTotalCells(accounts, (col, row) => col === column && row <= 17, false, fiscal);
        case 2:
            return getTotalCells(accounts, (col, row) => col === column && row >= 19 && row <= 22, false, fiscal);
        case 3:
            return getTotalCells(accounts, (col, row) => col === column && row >= 27 && row <= 37, false, fiscal);
        case 'general':
            return getTotalCells(accounts, col => col === column, false, fiscal);
        default:
            throw new Error(`Total ${totalId} not implemented`);
    }
}

function getTotalCells(accounts, filter, active, fiscal) {
    const settings = active ? activeSettings : passiveSettings;
    const cellKeys = _.keys(settings).filter(cellKey => {
        const cellPosition = getCellPosition(cellKey);
        return filter(cellPosition.col, cellPosition.row);
    });

    return cellKeys.reduce((a, b) => a + getValue(accounts, b, active, fiscal), 0);
}
