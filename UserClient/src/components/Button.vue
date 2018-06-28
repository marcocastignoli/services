<template>
    
    <button>Buy</button>
    
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Pacifico');
    button {
        height: 50px;
        min-width: 100px;
        border: none;
        background: linear-gradient(-90deg, #01baef, #20bf55);
        background-size: 200% 200%;
        background-position:100% 0%;
        border-radius: 50px;
        font-size: 25px;
        font-family: 'Pacifico', cursive;
        color: white;
        transition: all 1s;
        outline: 0;
    }
    button:hover {
        
        background-position:0% 0%;
        transform: scale(1.1, 1.1);
        transition: all 0.5s;
        box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.5);
    }
    button:hover, button:active, button:focus {
        outline: none;
    }
    button::-moz-focus-inner {
        border: 0;
    }
    button:active, button:target {
        background-position:100% 0%;
        transform: scale(1, 1);
        transition: all 0.1s;
        box-shadow: 0px 0px 0px;
    }
</style>
