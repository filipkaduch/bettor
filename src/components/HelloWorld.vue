<template>
  <div class="hello">
    <h1 class="bettorLogo" style="font-size: 2.5rem;">{{ msg }}</h1>
    <p>
      <span>Bettor</span> is an E-sports skills competition platform, providing a medium between players.
    </p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
