import { init } from "@paralleldrive/cuid2";

export const generateReference = init({
    length: 8,
    // A custom fingerprint for the host environment. This is used to help
    // prevent collisions when generating ids in a distributed system.
    fingerprint: 'swertesaya-backend',
});