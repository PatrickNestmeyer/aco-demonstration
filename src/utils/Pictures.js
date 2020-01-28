import Alanya from "../assets/alanya.jpg";
import Coconut from "../assets/coconut.jpg";
import FishAndChips from "../assets/fisch_and_chips.jpg";
import ForbiddenCity from "../assets/forbidden_city.jpg";
import GreenSmoothie from "../assets/green_smoothie.jpg";
import KohTao from "../assets/koh_tao.jpg";

export default class Pictures {
    static getPictureData() {
        return ([
            {
                id: "picture-1",
                image: Alanya,
                descr: "Alanya"
            },
            {
                id: "picture-2",
                image: Coconut,
                descr: "Coconut"
            },
            {
                id: "picture-3",
                image: FishAndChips,
                descr: "Fish and Chips"
            },
            {
                id: "picture-4",
                image: ForbiddenCity,
                descr: "Forbidden City"
            },
            {
                id: "picture-5",
                image: GreenSmoothie,
                descr: "Green Smoothie"
            },
            {
                id: "picture-6",
                image: KohTao,
                descr: "Koh Tao"
            }
        ]);
    }
}
