// Types for class T1
interface T1Props {
    remoteUrl: string,
    T1auth: T1Auth
    bucketAuth?: BucketAuth
}

interface T1Auth {
    password: string
}

interface BucketAuth {
    bucketName: string,
    authKey: string,
    authSecret: string,
}

interface UploadFileProps {
    file: File,
    name: string,
    type: string,
}

interface CreateBucketInstanceProps {
    bucketName: string,
    authKey: string,
    authSecret: string,
}

interface createBucketProps {
    name: string,
}

interface deleteBucketProps {
    bucketName: string,
}

interface Bucket {
    id: number,
    name: string,
    authKey: string,
    authSecret: string,
    createdAt: string,
    updatedAt: string,
}

declare class T1 {
    constructor(props: T1Props)
    createBucket: (props: createBucketProps) => Promise<Bucket>
    getFile: (fileId: number) => Promise<ArrayBuffer>
    uploadFile: (props: UploadFileProps) => Promise<boolean>
    createBucketInstance: (props: CreateBucketInstanceProps) => Promise<boolean>
    deleteBucket: (props: deleteBucketProps) => Promise<boolean>
}

declare namespace WLBT {
    export { T1 }
    export { T1Props }
    export { T1Auth }
    export { BucketAuth }
    export { UploadFileProps }
    export { CreateBucketInstanceProps }
    export { createBucketProps }
    export { deleteBucketProps }
    export { Bucket }
}