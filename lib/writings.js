import moment from 'moment';
import { Differences } from '/imports/api/collections';

function getLabel(accountNum, writing) {
    return accountNum === 'F19'
        ? 'DIVERGENCES DÉFINITIVES'
        : `${writing.lab}, AJUSTEMENT FISCAL`;
}

getWritings = function (writing) {
    const difference = Differences.findOne(writing.differenceId);
    const now = moment();
    const values = {
        originalWritingId: writing._id,
        date: now.toDate(),
        formattedDate: now.format('DD/MM/YYYY')
    };

    let debitFiscalWriting;
    let creditFiscalWriting;

    creditFiscalWriting = {
        ...values,
        accountNum: difference.creditAccount === 'auto'
            ? `F${writing.accountNum}`
            : difference.creditAccount,
        accountLab: getLabel(difference.creditAccount, writing),
        lab: writing.lab,
        journalCode: 'OF',
        debit: writing.credit,
        credit: writing.debit
    };

    debitFiscalWriting = {
        ...values,
        accountNum: difference.debitAccount === 'auto'
            ? `F${writing.accountNum}`
            : difference.debitAccount,
        accountLab: getLabel(difference.debitAccount, writing),
        lab: writing.lab,
        journalCode: 'OF',
        debit: writing.credit,
        credit: writing.debit
    };

    return [
        debitFiscalWriting,
        creditFiscalWriting
    ];
};
