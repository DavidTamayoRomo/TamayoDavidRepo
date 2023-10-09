import { registerEnumType } from "@nestjs/graphql";

export enum RepositoryStateFakeEnum {
    'verify' = 1,
    'approved' = 2,
    'rejected' = 3,
    'pending' = 4
}

export const RepositoryStateFakeValueEnum = {
    [RepositoryStateFakeEnum.verify]: 'verify',
    [RepositoryStateFakeEnum.approved]: 'approved',
    [RepositoryStateFakeEnum.rejected]: 'rejected',
    [RepositoryStateFakeEnum.pending]: 'pending',
};

export enum RepositoryStateEnum {
    'verify' = 604,
    'approved' = 606,
    'rejected' = 607,
    'pending' = 4
}

export const RepositoryStateValueEnum = {
    [RepositoryStateEnum.verify]: 'verify',
    [RepositoryStateEnum.approved]: 'approved',
    [RepositoryStateEnum.rejected]: 'rejected',
    [RepositoryStateEnum.pending]: 'pending',
};


export enum RepositoryCategoryEnum {
    'incident' = 1,
    'support' = 2,
    'error' = 3,
}

export const RepositoryCategoryValueEnum = {
    [RepositoryCategoryEnum.incident]: 'INCIDENTE',
    [RepositoryCategoryEnum.support]: 'SOPORTE',
    [RepositoryCategoryEnum.error]: 'ERROR'
};

export enum AccountType {
    INTERNAL = 'INTERNAL',
    PEOPLE = 'PEOPLE',
    OPERATIONS = 'OPERATIONS'
}

export enum statusType {
    PENDING = 'PENDING',
    PROCESSED = 'PROCESSED'
}

registerEnumType(AccountType, { name: 'AccountType' });
registerEnumType(statusType, { name: 'statusType' });
registerEnumType(RepositoryCategoryEnum, { name: 'ValidCategory' });
registerEnumType(RepositoryStateValueEnum, { name: 'ValidState' });
