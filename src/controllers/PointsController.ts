import { Request, Response } from 'express';

import knex from '../database/connection';

class PointsController {
  /**
   * Adiciona um ponto de coleta.
   * @param {Request} request
   * @param {Response} response
   * @returns
   * @memberof PointsController
   */
  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longetude,
      city,
      uf,
      items,
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      image:
        'https://images.unsplash.com/photo-1498579397066-22750a3cb424?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=80',
      name,
      email,
      whatsapp,
      latitude,
      longetude,
      city,
      uf,
    };

    const insertedIds = await trx('points').insert(point);

    const point_id = insertedIds[0];

    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id,
      };
    });

    await trx('point_items').insert(pointItems);

    await trx.commit();

    return response.json({
      id: point_id,
      ...point,
    });
  }

  /**
   * Retorna uma lista de pontos de coleta por Query.
   * @param {Request} request
   * @param {Response} response
   * @returns
   * @memberof PointsController
   */
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    return response.json(points);
  }

  /**
   * Retorna um ponto pelo ID.
   * @param {Request} request
   * @param {Response} response
   * @returns
   * @memberof PointsController
   */
  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response.status(400).json({ message: 'Point not found.' });
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({ point, items });
  }
}

export default PointsController;
