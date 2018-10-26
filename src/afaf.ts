// export type AF <ARGS extends any[], R> = (...args: ARGS) => Promise<R>;

export type HttpTriggerRequest = {

}

export type HttpTriggerResponse = {
    status?: number;
    body: any;
}

declare function httpTrigger (
    fn: (req: HttpTriggerRequest) => Promise<HttpTriggerResponse>
): (req: any, res: any) => Promise<void>;

export function withBindings <
    INBINDINGS extends unknown[] | [unknown],
> (
    getInBindings: (req: HttpTriggerRequest) => Promise<INBINDINGS>,
    fn: (req: HttpTriggerRequest, ...bindings: INBINDINGS) => Promise<HttpTriggerResponse>,
): (req: HttpTriggerRequest) => Promise<HttpTriggerResponse>;

export function withBindings <
    INBINDINGS extends unknown[] | [unknown],
    FNRESPONSE,
> (
    getInBindings: (req: HttpTriggerRequest) => Promise<INBINDINGS>,
    fn: (req: HttpTriggerRequest, ...bindings: INBINDINGS) => Promise<FNRESPONSE>,
    getOutBinding: (req: HttpTriggerRequest, fnresponse: FNRESPONSE) => Promise<HttpTriggerResponse>,
): (req: HttpTriggerRequest) => Promise<HttpTriggerResponse>;

export function withBindings (
    getInBindings: (req: HttpTriggerRequest) => Promise<unknown[]>,
    fn: (req: HttpTriggerRequest, ...bindings: unknown[]) => Promise<unknown>,
    getOutBinding?: (req: HttpTriggerRequest, fnresponse: unknown) => Promise<unknown>,
) {
    return async (req: HttpTriggerRequest) => {
        const fnresponse = await fn(req, ...await getInBindings(req));

        return getOutBinding
            ? getOutBinding(req, fnresponse)
            : fnresponse;
    }
}

const foo = httpTrigger(
    withBindings(
        req => Promise.resolve<[number, string]>([123, "hello"]),
        (req, n, s) => Promise.resolve(n),
        (req, n) =>  Promise.resolve({
            status: n,
            body: n.toString(),
        })
    )
)
