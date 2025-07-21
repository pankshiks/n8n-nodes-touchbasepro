import {
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
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
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [{ name: 'Transactional Email', value: 'transactionalEmail' }],
				default: 'transactionalEmail',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['transactionalEmail'] } },
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						action: 'Get all transactional emails',
						description: 'Retrieve list of smart emails',
						routing: {
							request: {
								method: 'GET',
								url: '/transactional/smartemails',
								qs: {
									page: '={{$parameter.page}}',
									pageSize: '={{$parameter.pageSize}}',
									sortBy: '={{$parameter.sortBy}}',
									sortDirection: '={{$parameter.sortDirection}}',
									status: '={{$parameter.status}}',
								},
							},
						},
					},
					{
						name: 'Create',
						value: 'create',
						action: 'Create smart email',
						description: 'Create a new smart email template',
						routing: {
							request: {
								method: 'POST',
								url: '/transactional/smartemails',
								body: {
									name: '={{$parameter.name}}',
									preheaderText: '={{$parameter.preheaderText}}',
									subject: '={{$parameter.subject}}',
									fromName: '={{$parameter.fromName}}',
									fromEmail: '={{$parameter.fromEmail}}',
									replyTo: '={{$parameter.replyTo}}',
									htmlUrl: '={{$parameter.htmlUrl}}',
									htmlContent: '={{$parameter.htmlContent}}',
								},
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get smart email by ID',
						description: 'Retrieve details of a smart email',
						routing: {
							request: {
								method: 'GET',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}',
							},
						},
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete smart email',
						description: 'Delete a smart email',
						routing: {
							request: {
								method: 'DELETE',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}',
							},
						},
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update smart email',
						description: 'Update an existing smart email',
						routing: {
							request: {
								method: 'PUT',
								url: '=/transactional/smartemails/{{$parameter.smartEmailIdDropdown}}',
								body: {
									name: '={{$parameter.name}}',
									preheaderText: '={{$parameter.preheaderText}}',
									subject: '={{$parameter.subject}}',
									fromName: '={{$parameter.fromName}}',
									fromEmail: '={{$parameter.fromEmail}}',
									replyTo: '={{$parameter.replyTo}}',
									htmlUrl: '={{$parameter.htmlUrl}}',
									htmlContent: '={{$parameter.htmlContent}}',
								},
							},
						},
					},
					{
						name: 'Activate',
						value: 'activate',
						action: 'Activate smart email',
						description: 'Activate a smart email',
						routing: {
							request: {
								method: 'PUT',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}/activateemail',
							},
						},
					},
					{
						name: 'Stats Count',
						value: 'statsCount',
						action: 'Get smart email stats count',
						description: 'Get state counts for a smart email',
						routing: {
							request: {
								method: 'GET',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}/stats',
							},
						},
					},
					{
						name: 'Get Messages',
						value: 'getMessages',
						action: 'Get messages of smart email',
						description: 'Retrieve messages of a smart email',
						routing: {
							request: {
								method: 'GET',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}/messages',
								qs: {
									StartDate: '={{$parameter.StartDate}}',
									EndDate: '={{$parameter.EndDate}}',
									page: '={{$parameter.page}}',
									pageSize: '={{$parameter.pageSize}}',
									sortBy: '={{$parameter.sortByMessages}}',
									sortDirection: '={{$parameter.sortDirection}}',
									IncludeEventData: '={{$parameter.IncludeEventData}}',
								},
							},
						},
					},
					{
						name: 'Send',
						value: 'send',
						action: 'Send smart email message',
						description: 'Send a message via smart email',
					},
					{
						name: 'Get Message',
						value: 'getMessage',
						action: 'Get sent message detail',
						description: 'Get detail of a sent message',
						routing: {
							request: {
								method: 'GET',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}/messages/{{$parameter.msgId}}',
							},
						},
					},
					{
						name: 'Resend Message',
						value: 'resendMessage',
						action: 'Resend message',
						description: 'Resend a sent message',
						routing: {
							request: {
								method: 'POST',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}/messages/{{$parameter.msgId}}',
							},
						},
					},
					{
						name: 'Get Message Status',
						value: 'getMessageStatus',
						action: 'Get message status',
						description: 'Retrieve status of a message',
						routing: {
							request: {
								method: 'GET',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}/messages/{{$parameter.msgId}}/status',
							},
						},
					},
				],
				default: 'getAll',
			},

			// --- Operation-specific properties below ---
			// For Create
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: { resource: ['transactionalEmail'], operation: ['create', 'update'] },
				},
			},
			{
				displayName: 'Preheader Text',
				name: 'preheaderText',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: { resource: ['transactionalEmail'], operation: ['create', 'update'] },
				},
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: { resource: ['transactionalEmail'], operation: ['create', 'update'] },
				},
			},
			{
				displayName: 'From Name',
				name: 'fromName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: { resource: ['transactionalEmail'], operation: ['create', 'update'] },
				},
			},
			{
				displayName: 'From Email',
				name: 'fromEmail',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: { resource: ['transactionalEmail'], operation: ['create', 'update'] },
				},
			},
			{
				displayName: 'Reply To',
				name: 'replyTo',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: { resource: ['transactionalEmail'], operation: ['create', 'update'] },
				},
			},
			{
				displayName: 'HTML URL',
				name: 'htmlUrl',
				type: 'string',
				required: false,
				default: '',
				displayOptions: {
					show: { resource: ['transactionalEmail'], operation: ['create', 'update'] },
				},
			},
			{
				displayName: 'HTML Content',
				name: 'htmlContent',
				type: 'string',
				required: false,
				default: '',
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['create'] } },
			},

			// For all operations that require Smart Email ID
			{
				displayName: 'Smart Email ID',
				name: 'smartEmailId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['transactionalEmail'],
						operation: [
							'get',
							'delete',
							'activate',
							'statsCount',
							'getMessages',
							'getMessage',
							'resendMessage',
							'getMessageStatus',
						],
					},
				},
			},

			// For getMessages
			{
				displayName: 'Start Date',
				name: 'StartDate',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['getMessages'] } },
			},
			{
				displayName: 'End Date',
				name: 'EndDate',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['getMessages'] } },
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				displayOptions: {
					show: { resource: ['transactionalEmail'], operation: ['getMessages', 'getAll'] },
				},
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				default: 100,
				displayOptions: {
					show: { resource: ['transactionalEmail'], operation: ['getMessages', 'getAll'] },
				},
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				options: [
					{ name: 'name', value: 'name' },
					{ name: 'date', value: 'date' },
				],
				default: 'name',
				displayOptions: {
					show: { resource: ['transactionalEmail'], operation: ['getAll'] },
				},
			},
			{
				displayName: 'Sort By',
				name: 'sortByMessages',
				type: 'options',
				options: [
					{ name: 'email', value: 'email' },
					{ name: 'date', value: 'date' },
				],
				default: 'email',
				displayOptions: {
					show: { resource: ['transactionalEmail'], operation: ['getMessages'] },
				},
			},
			{
				displayName: 'Sort Direction',
				name: 'sortDirection',
				type: 'options',
				options: [
					{ name: 'asc', value: 'asc' },
					{ name: 'desc', value: 'desc' },
				],
				default: 'asc',
				displayOptions: {
					show: { resource: ['transactionalEmail'], operation: ['getMessages', 'getAll'] },
				},
			},
			{
				displayName: 'Include Event Data',
				name: 'IncludeEventData',
				type: 'options',
				options: [
					{ name: 'Open', value: 'open' },
					{ name: 'Click', value: 'click' },
					{ name: 'All', value: 'all' },
					{ name: 'None', value: 'none' },
				],
				default: 'all',
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['getMessages'] } },
			},

			// For getMessage, resendMessage, getMessageStatus
			{
				displayName: 'Message ID',
				name: 'msgId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['transactionalEmail'],
						operation: ['getMessage', 'resendMessage', 'getMessageStatus'],
					},
				},
			},
			{
				displayName: 'Smart Email',
				name: 'smartEmailIdDropdown',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getSmartEmailOptions',
					searchable: true,
				},
				displayOptions: {
					show: { 
						resource: ['transactionalEmail'], 
						operation: ['send', 'update'] 
					},
				},
				required: true,
				default: '',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Active', value: 'active' },
					{ name: 'Draft', value: 'draft' },
				],
				default: 'all',
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['getAll'] } },
			},

			// Send fields
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
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['send'] } },
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
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['send'] } },
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
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['send'] } },
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
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['send'] } },
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
					{
						name: 'Current Day Name',
						displayName: 'Current Day Name',
						type: 'string',
						default: '',
					},
					{ name: 'Current Month', displayName: 'Current Month', type: 'string', default: '' },
					{
						name: 'Current Month Name',
						displayName: 'Current Month Name',
						type: 'string',
						default: '',
					},
					{ name: 'Current Year', displayName: 'Current Year', type: 'string', default: '' },
					{ name: 'Web Version', displayName: 'Web Version', type: 'string', default: '' },
					{
						name: 'Abuse / Spam complaints',
						displayName: 'Abuse / Spam complaints',
						type: 'string',
						default: '',
					},
					{ name: 'Unsubscribe', displayName: 'Unsubscribe', type: 'string', default: '' },
					{ name: 'Preferences', displayName: 'Preferences', type: 'string', default: '' },
				],
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['send'] } },
			},
			{
				displayName: 'Allow Tracking',
				name: 'allowTracking',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['send'] } },
			},
			{
				displayName: 'Ignore Suppression List',
				name: 'ignoreSuppressionList',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['send'] } },
			},
			{
				displayName: 'Add Recipient To List',
				name: 'addRecipientToList',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['send'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const creds = await this.getCredentials('touchBaseProApi');
	
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
	
		// Helper to unwrap a fixedCollection parameter
		const unwrap = <T>(param: any, field: string): T[] => {
			if (!param) return [];
			const v = param[field];
			if (Array.isArray(v)) return v;
			if (typeof v === 'object') return [v];
			return [];
		};
	
		if (resource === 'transactionalEmail' && operation === 'send') {
			// Existing transactionalEmail/send logic (unchanged)
			for (let i = 0; i < items.length; i++) {
				const smartEmailId = this.getNodeParameter('smartEmailIdDropdown', i) as string;
	
				// 1) To
				const toParam = this.getNodeParameter('To', i, {}) as any;
				const to = unwrap<{ name: string; email: string }>(toParam, 'to');
				if (!to.length) {
					throw new NodeOperationError(this.getNode(), 'At least one "To" recipient is required');
				}
	
				// 2) CC
				const ccParam = this.getNodeParameter('CC', i, {}) as any;
				const cc = unwrap<{ name: string; email: string }>(ccParam, 'cc');
	
				// 3) BCC
				const bccParam = this.getNodeParameter('BCC', i, {}) as any;
				const bcc = unwrap<{ name: string; email: string }>(bccParam, 'bcc');
	
				// 4) Attachments
				const attachParam = this.getNodeParameter('Attachments', i, {}) as any;
				const attachments = unwrap<{ name: string; type: string; data: string }>(
					attachParam,
					'attachments'
				);
	
				// 5) Fields
				const fields = this.getNodeParameter('Fields', i, {}) as { [key: string]: any };
	
				// 6) Booleans
				const allowTracking = this.getNodeParameter('allowTracking', i, false) as boolean;
				const ignoreSuppressionList = this.getNodeParameter('ignoreSuppressionList', i, false) as boolean;
				const addRecipientToList = this.getNodeParameter('addRecipientToList', i, false) as boolean;
	
				// Build minimal body
				const body: { [key: string]: any } = { to };
				if (cc.length) body.cc = cc;
				if (bcc.length) body.bcc = bcc;
				if (attachments.length) body.attachments = attachments;
				if (Object.keys(fields).length) body.fields = fields;
				if (allowTracking) body.allowTracking = true;
				if (ignoreSuppressionList) body.ignoreSuppressionList = true;
				if (addRecipientToList) body.addRecipientToList = true;
	
				// Send
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
	
				returnData.push({ json: response } as INodeExecutionData);
			}
	
			return [returnData];
		} else {
			// Generic handling for other resources and operations
			for (let i = 0; i < items.length; i++) {
				// Get generic parameters
				const method = this.getNodeParameter('method', i, 'GET') as IHttpRequestMethods; // Fix: Use IHttpRequestMethods
				const url = this.getNodeParameter('url', i) as string;
				const body = this.getNodeParameter('body', i, {}) as IDataObject; // Fix: Use IDataObject
				const queryParams = this.getNodeParameter('queryParams', i, {}) as IDataObject; // Fix: Use IDataObject
	
				// Build options for httpRequest
				const options: IHttpRequestOptions = {
					method,
					url: `https://api.touchbasepro.io${url.startsWith('/') ? '' : '/'}${url}`,
					json: true,
					auth: {
						username: creds.username as string,
						password: creds.password as string,
					},
				};
	
				// Add body for POST/PUT/PATCH requests
				if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && Object.keys(body).length) {
					options.body = body;
				}
	
				// Add query parameters if provided
				if (Object.keys(queryParams).length) {
					options.qs = queryParams;
				}
	
				try {
					const response = await this.helpers.httpRequest(options);
					returnData.push({ json: response } as INodeExecutionData);
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `Request failed: ${error.message}`, { itemIndex: i });
				}
			}
	
			return [returnData];
		}
	}

	methods = {
		loadOptions: {
			async getSmartEmailOptions(
				this: ILoadOptionsFunctions,
				filter?: string,
			): Promise<{ name: string; value: string }[]> {
				const creds = await this.getCredentials('touchBaseProApi');
				const pageSize = 100;
				let page = 1;
				let totalPages = 1;
				let allOptions: { name: string; value: string }[] = [];
		
				do {
					const qs: { [key: string]: any } = { page, pageSize };
					if (filter) {
						qs.search = filter;
					}
		
					const res = await this.helpers.request({
						method: 'GET',
						url: 'https://api.touchbasepro.io/email/transactional/smartemails',
						qs,
						json: true,
						auth: {
							user: creds.username as string,
							pass: creds.password as string,
						},
					});
		
					if (!Array.isArray(res.data)) {
						break;
					}
		
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
		}
	};
}