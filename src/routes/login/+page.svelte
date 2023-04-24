<script lang="ts">
	import 'virtual:windi.css'
	import {Lock, User, MapPin, BrandInstagram, BrandTwitter, BrandFacebook, BrandTiktok, PhoneCall} from "@steeze-ui/tabler-icons"
	import {Icon} from "@steeze-ui/svelte-icon"
	import Pascal from "$lib/images/pascalConFondo.png"
  import { enhance } from '$app/forms';

	let y: number;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<svelte:window bind:innerHeight="{y}"/>

<main class="flex flex-col-reverse xl:flex-row-reverse justify-center w-full">
	<section class="w-full xl:w-1/2 flex flex-col justify-center items-center mb-15 xl:mb-0">
		<form use:enhance method="post" class="flex flex-col justify-center items-center gap-5 login xl:h-1/2 h-full xl:mt-0 w-3/4">
            <img src={Pascal} alt="Instituto Pascal" class="w-1/5">
			<h1 class="text-6xl mb-15 font-bold flex justify-center items-center gap">Bienvenido, inicie sesión</h1>
			<label for="username" class="text-xl flex justify-end items-center border-dark-200 border-2 rounded-xl">
				<Icon src={User} class="h-15 w-15 mx-2"/>
				<input type="text" name="username" id="username" placeholder="Usuario" class="w-full border-0 outline-0 border-l-2 bg-transparent rounded-tr-lg rounded-br-lg text-xl">
			</label>
			<label for="password" class="text-xl flex justify-end items-center border-dark-200 border-2 rounded-xl">
				<Icon src={Lock} class="h-15 w-15 mx-2"/>
				<input type="password" name="password" id="password" placeholder="Contraseña" class="w-full border-0 outline-0 border-l-2 bg-transparent rounded-tr-lg rounded-br-lg text-xl">
			</label>
			<button type="submit" class="rounded-xl text-light-50 py-2 px-10 text-2xl m-auto bg-[#dc0183]">Enviar</button>
		</form>
	</section>
</main>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;700&family=PT+Serif:wght@400;700&display=swap');


	:global(body) {
		font-family: 'Hind Siliguri', sans-serif;

	}
	h1, h2, h3, h4, h5, h6{
		font-family: 'PT Serif', serif;
	}

	main{
		background-image: url("$lib/images/layered-waves-haikei.svg");
		background-size: cover;
		background-position: center center;
		background-attachment: fixed;
		height: auto;
		@media (min-width:1280px) {
			height: 100vh;
		}
	}

	.login{
		background-color: white;
		padding: 50px;
		border-radius: 20px;
		box-shadow: 10px 10px 59px 6px rgba(0,0,0,0.75);
-webkit-box-shadow: 10px 10px 59px 6px rgba(0,0,0,0.75);
-moz-box-shadow: 10px 10px 59px 6px rgba(0,0,0,0.75);
	}

</style>
