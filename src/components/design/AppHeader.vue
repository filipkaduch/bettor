<template>
    <div class="h-container">
        <h1 :data-text="text" :style="menu ? 'font-size: 20px !important;' : ''"><span>{{ text }}</span></h1>
    </div>
</template>

<script>

export default {
    name: 'AppHeader',
    props: {
        text: {
            type: String,
            default: ''
        },
        menu: {
            type: Boolean,
            default: false
        }
    }
}

</script>

<style lang="scss" scoped>
.h-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    background-color: transparent;
    overflow: hidden;
}

// h1 {
//     position: relative;
//     font-family: 'Montserrat', Arial, sans-serif;
//     font-size: calc(10px + 2vw);
//     font-weight: 700;
//     color: #fff;
//     letter-spacing: 0.02em;
//     text-transform: uppercase;
//     text-shadow: 0 0 0.15em #1da9cc;
//     user-select: none;
//     white-space: nowrap;
//     filter: blur(0.007em);
//     animation: shake 2.5s linear forwards;
// }

// h1 span {
//     position: absolute;
//     top: 0;
//     left: 0;
//     transform: translate(-50%, -50%);
//     -webkit-clip-path: polygon(10% 0%, 44% 0%, 70% 100%, 55% 100%);
//             clip-path: polygon(10% 0%, 44% 0%, 70% 100%, 55% 100%);
// }

// h1::before,
// h1::after {
//     content: attr(data-text);
//     position: absolute;
//     top: 0;
//     left: 0;
// }

// h1::before {
//     animation: crack1 2.5s linear forwards;
//     -webkit-clip-path: polygon(0% 0%, 10% 0%, 55% 100%, 0% 100%);
//             clip-path: polygon(0% 0%, 10% 0%, 55% 100%, 0% 100%);
// }

// h1::after {
//     animation: crack2 2.5s linear forwards;
//     -webkit-clip-path: polygon(44% 0%, 100% 0%, 100% 100%, 70% 100%);
//             clip-path: polygon(44% 0%, 100% 0%, 100% 100%, 70% 100%);
// }

// @keyframes shake {
//     5%, 15%, 25%, 35%, 55%, 65%, 75%, 95% {
//         filter: blur(0.018em);
//         transform: translateY(0.018em) rotate(0deg);
//     }

//     10%, 30%, 40%, 50%, 70%, 80%, 90% {
//         filter: blur(0.01em);
//         transform: translateY(-0.018em) rotate(0deg);
//     }

//     20%, 60% {
//         filter: blur(0.03em);
//         transform: translate(-0.018em, 0.018em) rotate(0deg);
//     }

//     45%, 85% {
//         filter: blur(0.03em);
//         transform: translate(0.018em, -0.018em) rotate(0deg);
//     }

//     100% {
//         filter: blur(0.007em);
//         transform: translate(0) rotate(-0.5deg);
//     }
// }

// @keyframes crack1 {
//     0%, 95% {
//         transform: translate(-50%, -50%);
//     }

//     100% {
//         transform: translate(-51%, -48%);
//     }
// }

// @keyframes crack2 {
//     0%, 95% {
//         transform: translate(-50%, -50%);
//     }

//     100% {
//         transform: translate(-49%, -53%);
//     }
// }



@mixin gradientWithShadow($start, $end, $shadow) {
    display: inline-block;
    font-weight: 900;
    font-size: 40px;
    position: relative;
    color: transparent;

    &:after {
        content: attr(data-text);
        position: absolute;
        left: 0;
        top: 0;
        background: linear-gradient(to bottom, $start, $end);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        z-index: 2;
    }

    &:before {
        content: attr(data-text);
        position: absolute;
        left: 0;
        top: 0;
        text-shadow: 0 5px 0 $shadow;
        z-index: 1;
    }
}

@import url(https://fonts.googleapis.com/css?family=Raleway:400,,800,900);
h1 {
   /* magic */
   @include gradientWithShadow(#FAF6F8, #8f94fb, #001E6C);
   
   /* styling */
   margin: auto;
   letter-spacing: 1px;
   font-family: Raleway, sans-serif;
}
</style>