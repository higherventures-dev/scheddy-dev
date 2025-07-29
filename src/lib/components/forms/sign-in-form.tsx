"use client";

import { signIn } from "#/lib/actions/sign-in";
import { signInSchema } from "#/lib/actions/sign-in.schema";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { TextInput } from "./text-input";

export function SignInForm() {
	const { register, handleSubmit } = useForm({
		resolver: zodResolver(signInSchema),
	});
	const [{ loading }, action] = useAsyncFn(signIn);

	return (
		<form className="flex flex-col gap-y-4" onSubmit={handleSubmit(action)}>
			<TextInput
				label="Email address"
				type="email"
				{...register("email", { required: true })}
				required
			/>

			<TextInput
				label="Password"
				type="password"
				{...register("password", { required: true, minLength: 8 })}
				required
				minLength={8}
			/>

			<Button
				className="cursor-pointer rounded-lg bg-white p-2.5 text-sm font-semibold text-[#1c1c1c]"
				type="submit"
			>
				{loading ? (
					<FontAwesomeIcon
						className="animate-spin"
						icon={faSpinner}
						width={20}
						height={20}
					/>
				) : (
					<span>Continue</span>
				)}
			</Button>
		</form>
	);
}
