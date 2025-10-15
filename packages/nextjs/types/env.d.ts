/* Env var typings for Chipi Pay integration */

declare namespace NodeJS {
	interface ProcessEnv {
		NEXT_PUBLIC_CHIPI_PUBLIC_KEY?: string; // public key for client SDK
		CHIPI_SECRET_KEY?: string;            // server secret key
		CHIPI_WEBHOOK_SECRET?: string;        // webhook signing secret
		NEXT_PUBLIC_CHIPI_MERCHANT_WALLET?: string; // merchant wallet address
	}
}


