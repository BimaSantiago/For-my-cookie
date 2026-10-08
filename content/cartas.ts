// Cartas "Ábrela cuando…". Para cambiar una, edita su texto; para agregar otra, copia un bloque.
// - id: un nombre corto y único (no lo cambies después de publicarla, se usa para saber si ya la leyó).
// - cuando: lo que aparece en el sobre, después de "Ábrela cuando…".
// - texto: cada párrafo va separado por una línea en blanco.
// - disponible: (opcional) fecha "año-mes-día" desde la que se puede abrir. Antes se ve con candado.

export type Carta = {
  id: string;
  cuando: string;
  texto: string;
  disponible?: string;
};

export const CARTAS: Carta[] = [
  {
    id: "triste",
    cuando: "estés triste",
    texto: `Galletita de mi corazón:

Si estás leyendo esto, algo te tiene triste, y me gustaría estar ahí para abrazarte en lugar de estar escrito en una pantalla.

Quiero que sepas que está bien sentirse así. No tienes que estar bien todo el tiempo, y no tienes que fingir conmigo. Puedes llorar, quejarte o quedarte callada; yo te voy a seguir queriendo igual.

Las cosas que hoy pesan mucho, un día van a pesar menos. Y mientras eso pasa, aquí estoy. Mándame un mensaje, aunque sea un "estoy triste", y te marco.

Te quiero muchísimo.`,
  },
  {
    id: "extranes",
    cuando: "me extrañes",
    texto: `Cariño:

Yo también te extraño. Seguro en este momento estoy pensando en ti, porque lo hago todo el tiempo.

Cierra los ojos tantito e imagina que te estoy abrazando por la espalda, de esos abrazos donde recargo mi cabeza en tu hombro. Ese abrazo te lo debo y te lo voy a pagar en cuanto te vea.

Mientras tanto, ve a abrir una galleta. Las escribí todas pensando en ti.

Ya falta menos para vernos.`,
  },
  {
    id: "dormir",
    cuando: "no puedas dormir",
    texto: `Corazón:

¿Otra vez despierta? Deja el celular un ratito después de leer esto, ¿va?

Respira hondo: cuatro segundos tomando aire, cuatro sosteniéndolo y cuatro soltándolo. Hazlo unas tres veces. Yo espero.

Ahora piensa en un gatito hecho bolita, calientito, ronroneando. Así quiero que te duermas tú: tranquila y sabiendo que alguien te quiere un montón.

Lo que te preocupa también va a estar ahí mañana, pero mañana vas a tener más fuerzas para resolverlo.

Buenas noches, galletita. Sueña bonito.`,
  },
  {
    id: "enojada",
    cuando: "estés enojada conmigo",
    texto: `Galletita:

Si abriste esta, seguro hice algo mal. Perdóname.

A veces no me doy cuenta de las cosas, o las digo de la peor manera. No es porque no me importes; es porque sigo aprendiendo a ser el novio que te mereces.

Tómate tu tiempo. Cuando quieras, platiquemos; quiero entender qué sentiste y arreglarlo. Prefiero mil veces hablarlo contigo que tener la razón.

Aunque estemos enojados, yo te sigo eligiendo.

PD: si se te pasa el enojo, tienes un cupón de "gano esta discusión" esperándote.`,
  },
  {
    id: "mal-dia",
    cuando: "tengas un mal día",
    texto: `Cariño:

Hoy no salió como querías, ¿verdad? Lo siento mucho.

Un mal día no te hace una mala persona, ni significa que lo estés haciendo mal. Solo fue un día difícil, y ya casi se acaba.

Haz algo bonito por ti: come algo rico, ponte tu pijama favorita, ve un video tonto o duérmete temprano. Te lo ganaste por aguantar hoy.

Y si quieres contármelo todo, aquí estoy para escucharte. Con chisme incluido.

Estoy muy orgulloso de ti.`,
  },
  {
    id: "reir",
    cuando: "necesites reírte",
    texto: `Galletita:

Datos curiosos que necesitas saber ahorita mismo:

Los gatos pasan cerca del 70% de su vida durmiendo. Básicamente son tú los domingos.

Un grupo de gatos se llama "clowder". Un grupo de galletas se llama "lo que me voy a comer si me descuido".

Y el dato más importante: tengo una novia que pone caras muy chistosas cuando algo le da risa. Seguro la estás poniendo ahorita.

¿Ya sonreíste? Misión cumplida.`,
  },
  {
    id: "dudes",
    cuando: "dudes de lo mucho que te quiero",
    texto: `Corazón de mi corazón:

Te quiero cuando estás feliz y cuando estás de malas. Cuando te arreglas y cuando andas en pijama. Cuando me cuentas tus cosas y cuando no tienes ganas de hablar.

Te quiero en los días buenos y en los que no son tan buenos.

Si alguna vez te hago sentir lo contrario, dímelo, porque no es verdad y quiero arreglarlo.

Esta página la hice para ti, con cada galleta y cada carta pensada en ti. Eso es lo mucho que te quiero.`,
  },
  {
    id: "estresada",
    cuando: "estés estresada",
    texto: `Cariño:

Para. Respira. Suelta los hombros (seguro los tienes tensos).

No tienes que resolver todo hoy. Escoge una sola cosa, la más pequeña, y empieza por ahí. Lo demás puede esperar un poquito.

Eres mucho más capaz de lo que crees. Te he visto con cosas difíciles y siempre sales adelante.

Y si necesitas un descanso, tómalo sin culpa. Yo te echo porras desde aquí.`,
  },
  {
    id: "seis-meses",
    cuando: "cumplamos medio año",
    disponible: "2026-11-30",
    texto: `Galletita de mi corazón:

¡Medio año! Seis meses de ti y de mí.

Gracias por cada plática, cada risa, cada vez que me tuviste paciencia y cada vez que me hiciste sentir que valgo la pena.

En estos meses aprendí muchas cosas de ti, y todavía me falta muchísimo por conocer. Tengo ganas de todo lo que viene.

Feliz medio año, mi amor. Vamos por muchos más.`,
  },
];
