<script lang="ts">
	import 'virtual:windi.css'
	import {Lock, User, MapPin, BrandInstagram, BrandTwitter, BrandFacebook, BrandTiktok, PhoneCall} from "@steeze-ui/tabler-icons"
	import {Icon} from "@steeze-ui/svelte-icon"
	import Pascal from "$lib/images/pascalConFondo.png"
    import type {ActionData} from "./$types";

    export let form: ActionData;
    $: if (form?.message){
			alert(form.message)
		}
  import { enhance } from '$app/forms';

	let y: number;
</script>

<svelte:head>
	<title>Login al sistema de administracion</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<svelte:window bind:innerHeight="{y}"/>
	<section class="w-full xl:w-1/2 flex flex-col justify-center items-center mb-15 xl:mb-0">
		<form use:enhance method="post" class="flex flex-col justify-center items-center gap-5 login xl:h-2/3 h-full xl:mt-0 w-3/4">
            <img src={Pascal} alt="Instituto Pascal" class="w-1/5">
			<h1 class="text-6xl mb-15 font-bold flex justify-center items-center gap">Bienvenido</h1>
			<label for="username" class="text-xl flex justify-end items-center border-dark-200 border-2 rounded-xl">
				<Icon src={User} class="h-15 w-15 mx-2"/>
				<input type="text" name="username" id="username" placeholder="Usuario" class="w-full border-0 outline-0 border-l-2 bg-transparent rounded-tr-lg rounded-br-lg text-xl">
			</label>
			<label for="password" class="text-xl flex justify-end items-center border-dark-200 border-2 rounded-xl">
				<Icon src={Lock} class="h-15 w-15 mx-2"/>
				<input type="password" name="password" id="password" placeholder="Contraseña" class="w-full border-0 outline-0 border-l-2 bg-transparent rounded-tr-lg rounded-br-lg text-xl">
			</label>
			<button type="submit" class="rounded-xl text-light-50 py-2 px-10 text-2xl m-auto bg-[#dc0183]">Enviar</button>
			<p class="text-lg">¿No tienes cuenta? <a href="/registrarse" class="font-bold">Regístrate</a></p>
		</form>
	</section>

<style lang="scss">

	.login{
		background-color: white;
		padding: 50px;
		border-radius: 20px;
		box-shadow: 10px 10px 59px 6px rgba(0,0,0,0.75);
-webkit-box-shadow: 10px 10px 59px 6px rgba(0,0,0,0.75);
-moz-box-shadow: 10px 10px 59px 6px rgba(0,0,0,0.75);
	}

</style>
