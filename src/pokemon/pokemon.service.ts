import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>) { }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon.save();
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      console.log('term is a number');

      pokemon = await this.pokemonModel.findOne({ no: term });
      console.log(pokemon);
    }


    // MONGO ID
    if (!pokemon && isValidObjectId(term)) pokemon = await this.pokemonModel.findById(term);
    // NAME
    if (!pokemon) pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });

    if (!pokemon) throw new NotFoundException(`Pokemon with term ${term} not found`);



    return pokemon

  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    try {
      if (updatePokemonDto.name) pokemon.name = updatePokemonDto.name.toLowerCase().trim();
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  async remove(id: string) {

    // const result = await this.pokemonModel.findByIdAndDelete(id);
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});

    if(deletedCount === 0) throw new NotFoundException(`Pokemon with id ${id} not found`);

    return;
  }


  private handleExceptions(error: any) {

    if (error.code === 11000) throw new BadRequestException(`Pokemon with name ${JSON.stringify(error.keyValue)} already exists`);
    console.log(error);
    throw new InternalServerErrorException('Something went wrong - check logs');
  }
}
