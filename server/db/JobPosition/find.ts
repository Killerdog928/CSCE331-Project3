"use server";

import { JobPosition } from "@/db";
import {
  parseFindOptions,
  parseOptionalFindOptions,
  throwIf,
  throwIfNotFound,
  throwIfNotUnique,
} from "@/server/backend/utils";
import {
  ClientFindOptions,
  parseJobPosition,
  JobPositionJson,
  ClientWhereOptions,
} from "@/server/db/types";

/**
 * Function to find all JobPositions based on optional client options.
 *
 * @param options - Optional client find options.
 * @returns A promise that resolves to an array of JobPosition JSON objects.
 */
export async function findAllJobPositions(
  options?: ClientFindOptions<JobPosition>,
): Promise<JobPositionJson[]> {
  return await JobPosition.findAll(parseOptionalFindOptions(options)).then(
    (es) => Promise.all(es.map(parseJobPosition)),
  );
}

/**
 * Function to find one JobPosition based on client options.
 *
 * @param options - Client find options.
 * @returns A promise that resolves to a JobPosition JSON object.
 */
export async function findOneJobPosition(
  options?: ClientFindOptions<JobPosition>,
): Promise<JobPositionJson> {
  return await JobPosition.findOne(parseOptionalFindOptions(options))
    .then(throwIfNotFound("JobPosition", options))
    .then(parseJobPosition);
}

/**
 * Function to find a unique JobPosition based on client options.
 *
 * @param options - Client find options.
 * @returns A promise that resolves to a JobPosition JSON object.
 */
export async function findUniqueJobPosition(
  options: ClientFindOptions<JobPosition>,
): Promise<JobPositionJson> {
  return await JobPosition.findAll(parseFindOptions(options))
    .then(throwIfNotUnique("JobPosition", options))
    .then(parseJobPosition);
}

/**
 * Function to find specific JobPositions based on an array of IDs or where options.
 *
 * @param where - Array of IDs or where options.
 * @param options - Optional client find options.
 * @returns A promise that resolves to an array of JobPosition JSON objects.
 */
export async function findSpecificJobPositions(
  where: number[] | ClientWhereOptions<JobPosition>[],
  options?: ClientFindOptions<JobPosition>,
): Promise<JobPositionJson[]> {
  return await JobPosition.findAll(
    parseFindOptions({
      ...options,
      where,
    }),
  )
    .then(
      throwIf(
        (es) => es.length !== where.length,
        `Couldn't find specific job positions: ${where}`,
      ),
    )
    .then((es) => Promise.all(es.map(parseJobPosition)));
}
