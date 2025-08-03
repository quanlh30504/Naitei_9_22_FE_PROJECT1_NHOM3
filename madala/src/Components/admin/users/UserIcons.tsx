import { MdCheck, MdLock } from 'react-icons/md';
import React from 'react';

export const CheckIcon = (props: React.ComponentProps<'svg'>) => (
    <MdCheck className="h-4 w-4 mr-1" {...props} />
);

export const LockIcon = (props: React.ComponentProps<'svg'>) => (
    <MdLock className="h-4 w-4 mr-1" {...props} />
);
