<script lang="ts">
	import 'virtual:windi.css'
</script>

<svelte:head>
	<title>Login al sistema de administracion</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<main class="flex flex-col-reverse xl:flex-row-reverse justify-center w-full">
    <slot/>
</main>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;700&family=PT+Serif:wght@400;700&display=swap');


	:global(body) {
		font-family: 'Hind Siliguri', sans-serif;

	}
	:global(h1, h2, h3, h4, h5, h6){
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

</style>
