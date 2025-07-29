import type { Meta, StoryObj } from "@storybook/react";
import { Month } from "./month";
import { dayjs } from "#/lib/dayjs";

const meta = {
	title: "Components/Calendar/Month",
	component: Month,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Month>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	name: "Month",
	args: {
		initialMonth: dayjs("2024-11-01"),
		currentDateTime: dayjs("2024-11-13T08:31:00Z"),
		events: [
			{
				id: 1,
				employeeId: 1,
				status: "confirmed",
				summary: "Anthony J.",
				description: "Continuing session",
				colorId: "1",
				start: {
					date: dayjs("2024-10-28"),
					dateTime: dayjs("2024-10-28T18:00:00Z"),
				},
				end: {
					date: dayjs("2024-10-28"),
					dateTime: dayjs("2024-10-28T20:00:00Z"),
				},
			},
			{
				id: 2,
				employeeId: 1,
				status: "confirmed",
				summary: "Andrew H.",
				description: "New tattoo session",
				colorId: "2",
				start: {
					date: dayjs("2024-10-30"),
					dateTime: dayjs("2024-10-30T09:00:00Z"),
				},
				end: {
					date: dayjs("2024-10-30"),
					dateTime: dayjs("2024-10-30T14:00:00Z"),
				},
			},
			{
				id: 3,
				employeeId: 1,
				status: "confirmed",
				summary: "Andrew H.",
				description: "New tattoo session",
				colorId: "3",
				start: {
					date: dayjs("2024-10-30"),
					dateTime: dayjs("2024-10-30T16:00:00Z"),
				},
				end: {
					date: dayjs("2024-10-30"),
					dateTime: dayjs("2024-10-30T21:00:00Z"),
				},
			},
			{
				id: 4,
				employeeId: 1,
				status: "tentative",
				summary: "David S.",
				description: "Continuing session",
				colorId: "2",
				start: {
					date: dayjs("2024-10-31"),
					dateTime: dayjs("2024-10-31T09:00:00Z"),
				},
				end: {
					date: dayjs("2024-10-31"),
					dateTime: dayjs("2024-10-31T11:00:00Z"),
				},
			},
			{
				id: 5,
				employeeId: 1,
				status: "confirmed",
				summary: "Martin L.",
				description: "New tattoo session",
				colorId: "2",
				start: {
					date: dayjs("2024-10-31"),
					dateTime: dayjs("2024-10-31T13:00:00Z"),
				},
				end: {
					date: dayjs("2024-10-31"),
					dateTime: dayjs("2024-10-31T18:00:00Z"),
				},
			},
			{
				id: 6,
				employeeId: 1,
				status: "confirmed",
				summary: "Anthony J.",
				description: "Continuing session",
				colorId: "1",
				start: {
					date: dayjs("2024-10-31"),
					dateTime: dayjs("2024-10-31T18:00:00Z"),
				},
				end: {
					date: dayjs("2024-10-31"),
					dateTime: dayjs("2024-10-31T20:00:00Z"),
				},
			},
			{
				id: 7,
				employeeId: 1,
				status: "confirmed",
				summary: "Anthony J.",
				description: "Continuing session",
				colorId: "4",
				start: {
					date: dayjs("2024-11-01"),
					dateTime: dayjs("2024-11-01T08:00:00Z"),
				},
				end: {
					date: dayjs("2024-11-01"),
					dateTime: dayjs("2024-11-01T10:00:00Z"),
				},
			},
			{
				id: 8,
				employeeId: 1,
				status: "tentative",
				summary: "David S.",
				description: "Continuing session",
				colorId: "2",
				start: {
					date: dayjs("2024-11-01"),
					dateTime: dayjs("2024-11-01T10:00:00Z"),
				},
				end: {
					date: dayjs("2024-11-01"),
					dateTime: dayjs("2024-11-01T13:00:00Z"),
				},
			},
			{
				id: 9,
				employeeId: 1,
				status: "tentative",
				summary: "David S.",
				description: "Continuing session",
				colorId: "2",
				start: {
					date: dayjs("2024-11-01"),
					dateTime: dayjs("2024-11-01T13:00:00Z"),
				},
				end: {
					date: dayjs("2024-11-01"),
					dateTime: dayjs("2024-11-01T15:00:00Z"),
				},
			},
			{
				id: 10,
				employeeId: 1,
				status: "confirmed",
				summary: "Anthony J.",
				description: "Continuing session",
				colorId: "5",
				start: {
					date: dayjs("2024-11-01"),
					dateTime: dayjs("2024-11-01T15:00:00Z"),
				},
				end: {
					date: dayjs("2024-11-01"),
					dateTime: dayjs("2024-11-01T19:00:00Z"),
				},
			},
			{
				id: 11,
				employeeId: 1,
				status: "tentative",
				summary: "David S.",
				description: "Continuing session",
				colorId: "2",
				start: {
					date: dayjs("2024-11-01"),
					dateTime: dayjs("2024-11-01T19:00:00Z"),
				},
				end: {
					date: dayjs("2024-11-01"),
					dateTime: dayjs("2024-11-01T21:00:00Z"),
				},
			},
			{
				id: 12,
				employeeId: 1,
				status: "tentative",
				summary: "David S.",
				description: "Continuing session",
				colorId: "2",
				start: {
					date: dayjs("2024-11-02"),
					dateTime: dayjs("2024-11-02T07:00:00Z"),
				},
				end: {
					date: dayjs("2024-11-02"),
					dateTime: dayjs("2024-11-02T09:00:00Z"),
				},
			},
			{
				id: 13,
				employeeId: 1,
				status: "confirmed",
				summary: "Martin L.",
				description: "New tattoo session",
				colorId: "6",
				start: {
					date: dayjs("2024-11-02"),
					dateTime: dayjs("2024-11-02T13:00:00Z"),
				},
				end: {
					date: dayjs("2024-11-02"),
					dateTime: dayjs("2024-11-02T18:00:00Z"),
				},
			},
			{
				id: 14,
				employeeId: 1,
				status: "confirmed",
				summary: "Anthony J.",
				description: "Continuing session",
				colorId: "4",
				start: {
					date: dayjs("2024-11-02"),
					dateTime: dayjs("2024-11-02T18:00:00Z"),
				},
				end: {
					date: dayjs("2024-11-02"),
					dateTime: dayjs("2024-11-02T20:00:00Z"),
				},
			},
		],
	},
};
