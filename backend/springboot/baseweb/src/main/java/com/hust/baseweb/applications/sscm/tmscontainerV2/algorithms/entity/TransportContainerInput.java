package com.hust.baseweb.applications.sscm.tmscontainerV2.algorithms.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TransportContainerInput {
    private List<Request> requests;
    private List<Truck> trucks;
    private List<Trailer> trailers;
    private List<DistanceElement> distances;
}
