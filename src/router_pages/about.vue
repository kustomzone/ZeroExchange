<template>
	<div id="about" class="container">
		<h1>About Page!</h1>
	</div>
</template>

<script>
	module.exports = {
		props: ["userInfo"],
		name: "about",
		data: () => {
			return {
				test: "Testing Data!"
			}
		}
	}
</script>