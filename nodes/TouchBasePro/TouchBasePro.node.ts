import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { IExecuteFunctions, NodeConnectionType } from 'n8n-workflow';

export class TouchBasePro implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TouchBasePro',
		name: 'touchbasepro',
		icon: 'file:logo.svg',
		group: [],
		version: 1,
		description: 'TouchBase Pro Node',
		defaults: {
			name: 'TouchBasePro',
		},
		credentials: [
			{
				name: 'touchBaseProApi',
				required: true,
			},
		],
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		requestDefaults: {
			baseURL: 'https://api.touchbasepro.io/email',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		usableAsTool: true,
		properties: [
			{
				displayName: 'Smart Email',
				name: 'smartEmailIdDropdown',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getSmartEmailOptions',
					searchable: true,
				},
				required: true,
				default: '',
			},
			{
				displayName: 'To',
				name: 'To',
				type: 'fixedCollection',
				required: true,
				default: [],
				options: [
					{
						name: 'to',
						displayName: 'To',
						values: [
							{ name: 'name', displayName: 'Name', type: 'string', default: '' },
							{ name: 'email', displayName: 'Email', type: 'string', default: '' },
						],
					},
				],
			},
			{
				displayName: 'CC',
				name: 'CC',
				type: 'fixedCollection',
				default: [],
				options: [
					{
						name: 'cc',
						displayName: 'CC',
						values: [
							{ name: 'name', displayName: 'Name', type: 'string', default: '' },
							{ name: 'email', displayName: 'Email', type: 'string', default: '' },
						],
					},
				],
			},
			{
				displayName: 'BCC',
				name: 'BCC',
				type: 'fixedCollection',
				default: [],
				options: [
					{
						name: 'bcc',
						displayName: 'BCC',
						values: [
							{ name: 'name', displayName: 'Name', type: 'string', default: '' },
							{ name: 'email', displayName: 'Email', type: 'string', default: '' },
						],
					},
				],
			},
			{
				displayName: 'Attachments',
				name: 'Attachments',
				type: 'fixedCollection',
				default: [],
				options: [
					{
						name: 'attachments',
						displayName: 'Attachment',
						values: [
							{ name: 'name', displayName: 'Name', type: 'string', default: '' },
							{ name: 'type', displayName: 'Type', type: 'string', default: '' },
							{ name: 'data', displayName: 'Data', type: 'string', default: '' },
						],
					},
				],
			},
			{
				displayName: 'Fields',
				name: 'Fields',
				type: 'collection',
				default: {},
				options: [
					{ name: 'Name', displayName: 'Name', type: 'string', default: '' },
					{ name: 'Email', displayName: 'Email', type: 'string', default: '' },
					{ name: 'ID', displayName: 'ID', type: 'string', default: '' },
					{ name: 'Random number', displayName: 'Random number', type: 'string', default: '' },
					{ name: 'Current Day', displayName: 'Current Day', type: 'string', default: '' },
					{ name: 'Abuse / Spam complaints', displayName: 'Abuse / Spam complaints', type: 'string', default: '' },
					{ name: 'Unsubscribe', displayName: 'Unsubscribe', type: 'string', default: '' },
					{ name: 'Preferences', displayName: 'Preferences', type: 'string', default: '' },
				],
			},
			{
				displayName: 'Allow Tracking',
				name: 'allowTracking',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Ignore Suppression List',
				name: 'ignoreSuppressionList',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Add Recipient To List',
				name: 'addRecipientToList',
				type: 'boolean',
				default: false,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const creds = await this.getCredentials('touchBaseProApi');

		const unwrap = <T>(param: any, field: string): T[] => {
			if (!param) return [];
			const v = param[field];
			if (Array.isArray(v)) return v;
			if (typeof v === 'object') return [v];
			return [];
		};

		for (let i = 0; i < items.length; i++) {
			const smartEmailId = this.getNodeParameter('smartEmailIdDropdown', i) as string;
			const to = unwrap<{ name: string; email: string }>(this.getNodeParameter('To', i, {}), 'to');
			if (!to.length) throw new NodeOperationError(this.getNode(), 'At least one "To" recipient is required');

			const cc = unwrap<{ name: string; email: string }>(this.getNodeParameter('CC', i, {}), 'cc');
			const bcc = unwrap<{ name: string; email: string }>(this.getNodeParameter('BCC', i, {}), 'bcc');
			const attachments = unwrap<{ name: string; type: string; data: string }>(this.getNodeParameter('Attachments', i, {}), 'attachments');
			const fields = this.getNodeParameter('Fields', i, {}) as IDataObject;
			const allowTracking = this.getNodeParameter('allowTracking', i, false);
			const ignoreSuppressionList = this.getNodeParameter('ignoreSuppressionList', i, false);
			const addRecipientToList = this.getNodeParameter('addRecipientToList', i, false);

			const body: IDataObject = { to };
			if (cc.length) body.cc = cc;
			if (bcc.length) body.bcc = bcc;
			if (attachments.length) body.attachments = attachments;
			if (Object.keys(fields).length) body.fields = fields;
			if (allowTracking) body.allowTracking = true;
			if (ignoreSuppressionList) body.ignoreSuppressionList = true;
			if (addRecipientToList) body.addRecipientToList = true;

			const response = await this.helpers.request({
				method: 'POST',
				url: `https://api.touchbasepro.io/email/transactional/smartemails/${smartEmailId}/messages`,
				body,
				json: true,
				auth: {
					user: creds.username as string,
					pass: creds.password as string,
				},
			});

			returnData.push({ json: response });
		}

		return [returnData];
	}

	methods = {
		loadOptions: {
			async getSmartEmailOptions(this: ILoadOptionsFunctions): Promise<{ name: string; value: string }[]> {
				const creds = await this.getCredentials('touchBaseProApi');
				const pageSize = 100;
				let page = 1;
				let totalPages = 1;
				let allOptions: { name: string; value: string }[] = [];

				do {
					const res = await this.helpers.request({
						method: 'GET',
						url: 'https://api.touchbasepro.io/email/transactional/smartemails',
						qs: { page, pageSize },
						json: true,
						auth: {
							user: creds.username as string,
							pass: creds.password as string,
						},
					});

					if (!Array.isArray(res.data)) break;

					totalPages = res.totalPages || 1;
					const options = res.data.map((e: any) => ({
						name: e.name,
						value: e.smartEmailId,
					}));

					allOptions.push(...options);
					page++;
				} while (page <= totalPages);

				return allOptions;
			},
		},
	};
}
