import { ServerStatusData } from "./types";

class ApiFetcher {

    public url: string;

    private async fetch(endpoint: string, data: any) {
        const resp = await fetch(`/api/${endpoint}`, {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data),
        })

        const response_data = await resp.json();

        return response_data;
    }

    async getServerStatus(ip: string, statusServerPort: number): Promise<ServerStatusData> {
        return this.fetch('server-status', {ip, statusServerPort})
    }
}

export default new ApiFetcher();
