import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TouchBaseProApi implements ICredentialType {
	name = 'touchBaseProApi';
	displayName = 'TouchBasePro API';
	documentationUrl = 'https://touchbasepro.io/apidocumentation/touchbasepro-api-documentation.html#section/Authentication';
	properties: INodeProperties[] = [
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.username}}',
				password: '={{$credentials.password}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.touchbasepro.io',
			url: '/email/transactional/smartemails',
			method: 'GET',
		},
	};
}
