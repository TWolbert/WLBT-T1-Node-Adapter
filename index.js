export default class T1 {
    #url;
    #bucketName;
    #authKey;
    #authSecret;
    #password;
    #bucketInstantiated = false;

    constructor({remoteUrl, T1auth: { password }, bucketAuth: { bucketName, authKey, authSecret } = null}) {
        this.#url = remoteUrl;
        this.#password = password;

        if (bucketName && authKey && authSecret) { 
            this.#bucketName = bucketName;
            this.#authKey = authKey;
            this.#authSecret = authSecret;
            this.#bucketInstantiated = true;
        }
    }

    
    /**
     * Description
     * @param {number} fileId
     * @returns {Promise<ArrayBuffer>}
     */
    async getFile(fileId) {
        if (!this.#bucketInstantiated) {
            throw new Error("Bucket not instantiated");
        }

        const response = await fetch(`${this.#url}/api/file/${fileId}?bucket=${this.#bucketName}&authKey=${this.#authKey}&authSecret=${this.#authSecret}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.#password}`,
            },
        });
        
        // File is returned as octet-stream
        const blob = await response.blob();

        // Convert blob to buffer
        return await blob.arrayBuffer();
    }

    /**
     * Description
     * @param {File} file
     * @param {string} name (e.g image.png)
     * @param {string} type (e.g image/png)
     * @returns {Promise<boolean>} true or false
     * 
     * **Usage**:
     * const file = document.querySelector("input[type=file]").files[0];
     * 
     * t1.uploadFile({
     *   file,
     *   name: file.name,
     *   type: file.type,
     * });
     */
    async uploadFile({ file, name, type }) { 
        if (!this.#bucketInstantiated) {
            throw new Error("Bucket not instantiated");
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", name);
        formData.append("type", type);
        formData.append("bucket", this.#bucketName);
        formData.append("authKey", this.#authKey);
        formData.append("authSecret", this.#authSecret);

        const response = await fetch(`${this.#url}/api/file`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.#password}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload file");
        }

        return true;
    }

    /**
     * Description
     * @param {string} {name}
     * @returns {Promise<Object>} Bucket info
     * 
     * **Return object shape**:
     * name: string,
     * authKey: string,
     * authSecret: string,
     * createdAt: string,
     * updatedAt: string
     */
    async createBucket({ name }) {
        const response = await fetch(`${this.#url}/api/bucket`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.#password}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        });

        if (!response.ok) {
            throw new Error("Failed to create bucket");
        }

        return await response.json();
    }

    /**
     * Description
     * @param {string} bucketName
     * @param {string} authKey
     * @param {string} authSecret
     * @returns {Promise<boolean>}
     * @throws {Error} Failed to create bucket instance
     * 
     * **Usage**:
     * t1.createBucketInstance({
     *  bucketName: "bucketName",
     *  authKey: "authKey",
     *  authSecret: "authSecret",
     * });
     * 
     * Checks if your auth is valid and if so returns true
     */
    async createBucketInstance({ bucketName, authKey, authSecret }) {
        this.#bucketName = bucketName;
        this.#authKey = authKey;
        this.#authSecret = authSecret;

        const res = await fetch(`${this.#url}/api/bucket/check`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.#password}`,
            },
            body: JSON.stringify({ bucketName, authKey, authSecret }),
        });

        if (!res.ok) {
            throw new Error("Failed to create bucket instance");
        }

        this.#bucketInstantiated = true;
        return await res.json();
    }

    /**
     * Description
     * @param {string} {bucketName}
     * @returns {boolean}
     * @throws {Error} Failed to delete bucket
     */
    async deleteBucket({ bucketName }) {
        const response = await fetch(`${this.#url}/api/bucket/${bucketName}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${this.#password}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete bucket");
        }

        return true;
    }
}