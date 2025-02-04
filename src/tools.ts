import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { temboClient } from "./index.js";
import type {
	CreateInstance,
	PatchInstance,
	RestoreInstance,
} from "@tembo-io/api-client";

const TOOLS = [
	{
		name: "get_all_apps" as const,
		description: "Get attributes for all apps",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},
	{
		name: "get_app" as const,
		description: "Get the attributes of a single App",
		inputSchema: {
			type: "object",
			properties: {
				type: {
					type: "string",
					description: "The app type to get details for",
				},
			},
			required: ["type"],
		},
	},
	{
		name: "ask_tembo" as const,
		description: "Ask a question to Tembo Docs",
		inputSchema: {
			type: "object",
			properties: {
				query: {
					type: "string",
					description:
						'The ask query. For example, "how to create a Tembo instance"',
				},
			},
			required: ["query"],
		},
	},
	{
		name: "get_instance_schema" as const,
		description: "Get the json-schema for an instance",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},
	{
		name: "get_all_instances" as const,
		description: "Get all Tembo instances in an organization",
		inputSchema: {
			type: "object",
			properties: {
				org_id: {
					type: "string",
					description: "Organization id for the request",
				},
			},
			required: ["org_id"],
		},
	},
	{
		name: "create_instance" as const,
		description: "Create a new Tembo instance",
		inputSchema: {
			type: "object",
			properties: {
				org_id: {
					type: "string",
					description: "Organization ID that owns the Tembo instance",
				},
				instance_name: { type: "string" },
				stack_type: {
					type: "string",
					enum: [
						"Analytics",
						"Geospatial",
						"MachineLearning",
						"MessageQueue",
						"MongoAlternative",
						"OLTP",
						"ParadeDB",
						"Standard",
						"Timeseries",
						"VectorDB",
					],
				},
				cpu: {
					type: "string",
					enum: ["0.25", "0.5", "1", "2", "4", "6", "8", "12", "16", "32"],
				},
				memory: {
					type: "string",
					enum: [
						"512Mi",
						"1Gi",
						"2Gi",
						"4Gi",
						"8Gi",
						"12Gi",
						"16Gi",
						"24Gi",
						"32Gi",
						"64Gi",
					],
				},
				storage: {
					type: "string",
					enum: [
						"10Gi",
						"50Gi",
						"100Gi",
						"200Gi",
						"300Gi",
						"400Gi",
						"500Gi",
						"1Ti",
						"1.5Ti",
						"2Ti",
					],
				},
				environment: { type: "string", enum: ["dev", "test", "prod"] },
				replicas: { type: "integer" },
				spot: { type: "boolean" },
			},
			required: [
				"org_id",
				"instance_name",
				"stack_type",
				"cpu",
				"memory",
				"storage",
				"environment",
			],
		},
	},
	{
		name: "get_instance" as const,
		description: "Get an existing Tembo instance",
		inputSchema: {
			type: "object",
			properties: {
				org_id: {
					type: "string",
					description: "Organization ID that owns the instance",
				},
				instance_id: { type: "string" },
			},
			required: ["org_id", "instance_id"],
		},
	},
	{
		name: "delete_instance" as const,
		description: "Delete an existing Tembo instance",
		inputSchema: {
			type: "object",
			properties: {
				org_id: {
					type: "string",
					description: "Organization id of the instance to delete",
				},
				instance_id: { type: "string", description: "Delete this instance id" },
			},
			required: ["org_id", "instance_id"],
		},
	},
	{
		name: "patch_instance" as const,
		description: "Update attributes on an existing Tembo instance",
		inputSchema: {
			type: "object",
			properties: {
				org_id: {
					type: "string",
					description: "Organization ID that owns the instance",
				},
				instance_id: { type: "string" },
				instance_name: { type: "string" },
				cpu: {
					type: "string",
					enum: ["0.25", "0.5", "1", "2", "4", "6", "8", "12", "16", "32"],
				},
				memory: {
					type: "string",
					enum: [
						"512Mi",
						"1Gi",
						"2Gi",
						"4Gi",
						"8Gi",
						"12Gi",
						"16Gi",
						"24Gi",
						"32Gi",
						"64Gi",
					],
				},
				storage: {
					type: "string",
					enum: [
						"10Gi",
						"50Gi",
						"100Gi",
						"200Gi",
						"300Gi",
						"400Gi",
						"500Gi",
						"1Ti",
						"1.5Ti",
						"2Ti",
					],
				},
				environment: { type: "string", enum: ["dev", "test", "prod"] },
				replicas: { type: "integer" },
				spot: { type: "boolean" },
			},
			required: ["org_id", "instance_id"],
		},
	},
	{
		name: "restore_instance" as const,
		description: "Restore a Tembo instance",
		inputSchema: {
			type: "object",
			properties: {
				org_id: {
					type: "string",
					description: "Organization ID that owns the Tembo instance",
				},
				instance_name: { type: "string" },
				restore: {
					type: "object",
					properties: {
						instance_id: { type: "string" },
						recovery_target_time: { type: "string", format: "date-time" },
					},
					required: ["instance_id"],
				},
			},
			required: ["org_id", "instance_name", "restore"],
		},
	},
] satisfies Tool[];

export type ToolName = (typeof TOOLS)[number]["name"];

const TOOL_HANDLERS = {
	get_all_apps: async () => {
		return await temboClient.getAllApps();
	},

	get_app: async ({ type }: { type: string }) => {
		return await temboClient.getApp({ path: { type } });
	},

	ask_tembo: async ({ query }: { query: string }) => {
		return await temboClient.ask({
			query: {
				query,
			},
		});
	},

	get_instance_schema: async () => {
		return await temboClient.getSchema();
	},

	get_all_instances: async ({ org_id }: { org_id: string }) => {
		return await temboClient.getAll({ path: { org_id } });
	},

	create_instance: async (props: CreateInstance & { org_id: string }) => {
		return await temboClient.createInstance({
			body: { ...props },
			path: { org_id: props.org_id },
		});
	},

	get_instance: async ({
		org_id,
		instance_id,
	}: {
		org_id: string;
		instance_id: string;
	}) => {
		return await temboClient.getInstance({
			path: { org_id, instance_id },
		});
	},

	delete_instance: async ({
		org_id,
		instance_id,
	}: {
		org_id: string;
		instance_id: string;
	}) => {
		return await temboClient.deleteInstance({
			path: { org_id, instance_id },
		});
	},

	patch_instance: async (
		props: PatchInstance & { org_id: string; instance_id: string },
	) => {
		return await temboClient.patchInstance({
			body: { ...props },
			path: { org_id: props.org_id, instance_id: props.instance_id },
		});
	},

	restore_instance: async (props: RestoreInstance & { org_id: string }) => {
		return await temboClient.restoreInstance({
			body: { ...props },
			path: { org_id: props.org_id },
		});
	},
} as const;

export { TOOLS, TOOL_HANDLERS };
