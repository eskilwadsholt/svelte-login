import { sequence } from '@sveltejs/kit/hooks';

// since we are on server side - the console.logs will be written to the server terminal running the project ...
/// type: import('@sveltejs/kit').Handle
async function first({ event, resolve }) {
    console.log("Event consists of: " + Object.keys(event));

    // Splitting request
    const request = event.request;
    console.log("Request consists of: " + Object.keys(request));
    const headers = request.headers;
    console.log("Headers are:", headers);

    const result = await resolve(event);

    return result;
}

/// type: import('@sveltejs/kit').Handle
async function second({ event, resolve }) {
	console.log('second pre-processing');
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => {
			console.log('second transform');
			return html;
		},
		preload: () => {
			console.log('second preload');
		},
		filterSerializedResponseHeaders: () => {
			// this one wins as it's the first defined in the chain
			console.log('second filterSerializedResponseHeaders');
		}
	});
	console.log('second post-processing');

	return result;
}

export const handle = sequence(first, second);