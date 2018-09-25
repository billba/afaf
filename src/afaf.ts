// export type AF <ARGS extends any[], R> = (...args: ARGS) => Promise<R>;

export type HttpTriggerRequest = {

}

export type HttpTriggerResponse = {

}

declare function HttpTrigger (
    fn: (req: HttpTriggerRequest) => Promise<HttpTriggerResponse>
): Promise<void>;

