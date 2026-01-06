<template>
  <div class="hello">
    <Card style="width: 25rem; overflow: hidden">
      <template #header>
        <img alt="user header" src="../assets/logo.png" />
      </template>
      <template #title>Advanced Card</template>
      <template #subtitle>Card subtitle</template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam
          deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
          neque
          quas!
        </p>
      </template>
      <template #footer>
        <div class="flex gap-4 mt-1">
          <!-- <Button label="Cancel" severity="secondary" variant="outlined" class="w-full" />
          <Button label="Save" class="w-full" /> -->
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card';

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
