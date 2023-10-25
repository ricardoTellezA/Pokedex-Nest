import { SchemaFactory } from "@nestjs/mongoose";
import { Prop, Schema } from "@nestjs/mongoose/dist/decorators";
import { Document } from "mongoose";

@Schema()
export class Pokemon extends Document {
    @Prop({
        unique: true,
        index: true,
    })

    name: string;

    @Prop({
        unique: true,
        index: true,
    })
    no: number;

}



export const PokemonSchema = SchemaFactory.createForClass(Pokemon);